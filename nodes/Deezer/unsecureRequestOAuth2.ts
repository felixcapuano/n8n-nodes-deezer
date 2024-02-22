import type {
	ClientOAuth2Options,
	ClientOAuth2RequestObject,
	ClientOAuth2TokenData,
} from '@n8n/client-oauth2';
import { ClientOAuth2 } from '@n8n/client-oauth2';
import type { AxiosError } from 'axios';
import get from 'lodash/get';
import type {
	IAllExecuteFunctions,
	ICredentialDataDecryptedObject,
	IDataObject,
	IHttpRequestOptions,
	INode,
	IOAuth2Options,
	IWorkflowExecuteAdditionalData,
} from 'n8n-workflow';
import { LoggerProxy as Logger, NodeApiError } from 'n8n-workflow';
import type { IResponseError } from 'n8n-core';

export async function unsecureRequestOAuth2(
	this: IAllExecuteFunctions,
	credentialsType: string,
	requestOptions: IHttpRequestOptions,
	node: INode,
	additionalData: IWorkflowExecuteAdditionalData,
	oAuth2Options?: IOAuth2Options,
	isN8nRequest = false,
) {
	const credentials = (await this.getCredentials(
		credentialsType,
	)) as unknown as ICredentialDataDecryptedObject;

	// Only the OAuth2 with authorization code grant needs connection
	if (credentials.grantType === 'authorizationCode' && credentials.oauthTokenData === undefined) {
		throw new NodeApiError(this.getNode(), { message: 'OAuth credentials not connected' });
	}

	const oAuthClient = new ClientOAuth2({
		clientId: credentials.clientId,
		clientSecret: credentials.clientSecret,
		accessTokenUri: credentials.accessTokenUrl,
		scopes: (credentials.scope as string).split(' '),
		ignoreSSLIssues: credentials.ignoreSSLIssues,
		authentication: credentials.authentication ?? 'header',
	} as ClientOAuth2Options);

	let oauthTokenData = credentials.oauthTokenData as ClientOAuth2TokenData;
	// if it's the first time using the credentials, get the access token and save it into the DB.
	if (
		credentials.grantType === 'clientCredentials' &&
		(oauthTokenData === undefined || Object.keys(oauthTokenData).length === 0)
	) {
		const { data } = await oAuthClient.credentials.getToken();
		// Find the credentials
		if (!node.credentials?.[credentialsType]) {
			throw new NodeApiError(this.getNode(), {
				message: 'Node does not have credential type',
				extra: { nodeName: node.name },
				tags: { credentialType: credentialsType },
			});
		}

		const nodeCredentials = node.credentials[credentialsType];
		credentials.oauthTokenData = data;

		// Save the refreshed token
		await additionalData.credentialsHelper.updateCredentials(
			nodeCredentials,
			credentialsType,
			credentials as unknown as ICredentialDataDecryptedObject,
		);

		oauthTokenData = data;
	}

	const accessToken =
		get(oauthTokenData, oAuth2Options?.property as string) || oauthTokenData.accessToken;
	const refreshToken = oauthTokenData.refreshToken;
	const token = oAuthClient.createToken(
		{
			...oauthTokenData,
			...(accessToken ? { access_token: accessToken } : {}),
			...(refreshToken ? { refresh_token: refreshToken } : {}),
		},
		oAuth2Options?.tokenType || oauthTokenData.tokenType,
	);

	// TODO: not sure
	// (requestOptions as IHttpRequestOptions).rejectUnauthorized = !credentials.ignoreSSLIssues;
	(requestOptions as IHttpRequestOptions).skipSslCertificateValidation =
		!credentials.ignoreSSLIssues;

	// Signs the request by adding authorization headers or query parameters depending
	// on the token-type used.
	const newRequestOptions = token.sign(requestOptions as ClientOAuth2RequestObject);
	const newRequestHeaders = (newRequestOptions.headers = newRequestOptions.headers ?? {});
	// If keep bearer is false remove the it from the authorization header
	if (oAuth2Options?.keepBearer === false && typeof newRequestHeaders.Authorization === 'string') {
		newRequestHeaders.Authorization = newRequestHeaders.Authorization.split(' ')[1];
	}
	if (oAuth2Options?.keyToIncludeInAccessTokenHeader) {
		Object.assign(newRequestHeaders, {
			[oAuth2Options.keyToIncludeInAccessTokenHeader]: token.accessToken,
		});
	}
	if (isN8nRequest) {
		return await this.helpers.httpRequest(newRequestOptions).catch(async (error: AxiosError) => {
			if (error.response?.status === 401) {
				Logger.debug(
					`OAuth2 token for "${credentialsType}" used by node "${node.name}" expired. Should revalidate.`,
				);
				const tokenRefreshOptions: IDataObject = {};
				if (oAuth2Options?.includeCredentialsOnRefreshOnBody) {
					const body: IDataObject = {
						client_id: credentials.clientId,
						...(credentials.grantType === 'authorizationCode' && {
							client_secret: credentials.clientSecret as string,
						}),
					};
					tokenRefreshOptions.body = body;
					tokenRefreshOptions.headers = {
						Authorization: '',
					};
				}

				let newToken;

				Logger.debug(
					`OAuth2 token for "${credentialsType}" used by node "${node.name}" has been renewed.`,
				);
				// if it's OAuth2 with client credentials grant type, get a new token
				// instead of refreshing it.
				if (credentials.grantType === 'clientCredentials') {
					newToken = await token.client.credentials.getToken();
				} else {
					newToken = await token.refresh(tokenRefreshOptions as unknown as ClientOAuth2Options);
				}

				Logger.debug(
					`OAuth2 token for "${credentialsType}" used by node "${node.name}" has been renewed.`,
				);

				credentials.oauthTokenData = newToken.data;
				// Find the credentials
				if (!node.credentials?.[credentialsType]) {
					throw new NodeApiError(this.getNode(), {
						message: 'Node does not have credential type',
						extra: { nodeName: node.name, credentialType: credentialsType },
					});
				}
				const nodeCredentials = node.credentials[credentialsType];
				await additionalData.credentialsHelper.updateCredentials(
					nodeCredentials,
					credentialsType,
					credentials as unknown as ICredentialDataDecryptedObject,
				);
				const refreshedRequestOption = newToken.sign(requestOptions as ClientOAuth2RequestObject);

				if (oAuth2Options?.keyToIncludeInAccessTokenHeader) {
					Object.assign(newRequestHeaders, {
						[oAuth2Options.keyToIncludeInAccessTokenHeader]: token.accessToken,
					});
				}

				return await this.helpers.httpRequest(refreshedRequestOption);
			}
			throw error;
		});
	}
	const tokenExpiredStatusCode =
		oAuth2Options?.tokenExpiredStatusCode === undefined
			? 401
			: oAuth2Options?.tokenExpiredStatusCode;

	return await this.helpers
		.request(newRequestOptions as IHttpRequestOptions)
		.then((response) => {
			const requestOptions = newRequestOptions as any;
			if (
				requestOptions.resolveWithFullResponse === true &&
				requestOptions.simple === false &&
				response.statusCode === tokenExpiredStatusCode
			) {
				throw response;
			}
			return response;
		})
		.catch(async (error: IResponseError) => {
			if (error.statusCode === tokenExpiredStatusCode) {
				// Token is probably not valid anymore. So try refresh it.
				const tokenRefreshOptions: IDataObject = {};
				if (oAuth2Options?.includeCredentialsOnRefreshOnBody) {
					const body: IDataObject = {
						client_id: credentials.clientId,
						client_secret: credentials.clientSecret,
					};
					tokenRefreshOptions.body = body;
					// Override authorization property so the credentials are not included in it
					tokenRefreshOptions.headers = {
						Authorization: '',
					};
				}
				Logger.debug(
					`OAuth2 token for "${credentialsType}" used by node "${node.name}" expired. Should revalidate.`,
				);

				let newToken;

				// if it's OAuth2 with client credentials grant type, get a new token
				// instead of refreshing it.
				if (credentials.grantType === 'clientCredentials') {
					newToken = await token.client.credentials.getToken();
				} else {
					newToken = await token.refresh(tokenRefreshOptions as unknown as ClientOAuth2Options);
				}
				Logger.debug(
					`OAuth2 token for "${credentialsType}" used by node "${node.name}" has been renewed.`,
				);

				credentials.oauthTokenData = newToken.data;

				// Find the credentials
				if (!node.credentials?.[credentialsType]) {
					throw new NodeApiError(this.getNode(), {
						message: 'Node does not have credential type',
						tags: { credentialType: credentialsType },
						extra: { nodeName: node.name },
					});
				}
				const nodeCredentials = node.credentials[credentialsType];

				// Save the refreshed token
				await additionalData.credentialsHelper.updateCredentials(
					nodeCredentials,
					credentialsType,
					credentials as unknown as ICredentialDataDecryptedObject,
				);

				Logger.debug(
					`OAuth2 token for "${credentialsType}" used by node "${node.name}" has been saved to database successfully.`,
				);

				// Make the request again with the new token
				const newRequestOptions = newToken.sign(requestOptions as ClientOAuth2RequestObject);
				newRequestOptions.headers = newRequestOptions.headers ?? {};

				if (oAuth2Options?.keyToIncludeInAccessTokenHeader) {
					Object.assign(newRequestOptions.headers, {
						[oAuth2Options.keyToIncludeInAccessTokenHeader]: token.accessToken,
					});
				}

				return await this.helpers.request(newRequestOptions as IHttpRequestOptions);
			}

			// Unknown error so simply throw it
			throw error;
		});
}


export async function simplifiedRequestOAuth2(
	this: IAllExecuteFunctions,
	credentialsType: string,
	requestOptions: IHttpRequestOptions | IRequestOptions,
  ) {
	const credentials = await this.getCredentials(credentialsType) as OAuth2CredentialData;
  
	const oAuthClient = new ClientOAuth2({
	  clientId: credentials.clientId,
	  clientSecret: credentials.clientSecret,
	  accessTokenUri: credentials.accessTokenUrl,
	  scopes: (credentials.scope as string).split(' '),
	  ignoreSSLIssues: credentials.ignoreSSLIssues,
	  authentication: credentials.authentication ?? 'header',
	});
  
	const oauthTokenData = credentials.oauthTokenData as ClientOAuth2TokenData;
	const token = oAuthClient.createToken({
	  ...oauthTokenData,
	  accessToken: oauthTokenData?.accessToken,
	  refreshToken: oauthTokenData?.refreshToken,
	});
  
	const newRequestOptions = token.sign(requestOptions as ClientOAuth2RequestObject);
  
	return await this.helpers.httpRequest(newRequestOptions);
  }

  export async function simplifiedUnsecureRequestOAuth2(
	this: IAllExecuteFunctions,
	credentialsType: string,
	requestOptions: IHttpRequestOptions | IRequestOptions,
  ) {
	const credentials = await this.getCredentials(credentialsType) as OAuth2CredentialData;
  
	const oAuthClient = new ClientOAuth2({
	  clientId: credentials.clientId,
	  clientSecret: credentials.clientSecret,
	  accessTokenUri: credentials.accessTokenUrl,
	  scopes: (credentials.scope as string).split(' '),
	  ignoreSSLIssues: credentials.ignoreSSLIssues,
	  authentication: credentials.authentication ?? 'header',
	});
  
	const oauthTokenData = credentials.oauthTokenData as ClientOAuth2TokenData;
	const token = oAuthClient.createToken({
	  ...oauthTokenData,
	  accessToken: oauthTokenData?.accessToken,
	  refreshToken: oauthTokenData?.refreshToken,
	});
  
	const newRequestOptions = token.sign(requestOptions as ClientOAuth2RequestObject);
	const queryParameters = new URLSearchParams(newRequestOptions.query);
	queryParameters.set('access_token', token.accessToken);
	newRequestOptions.query = queryParameters.toString();
  
	return await this.helpers.httpRequest(newRequestOptions);
  }
  