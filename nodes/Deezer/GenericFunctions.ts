import type { ClientOAuth2Options, ClientOAuth2TokenData } from '@n8n/client-oauth2';
import { ClientOAuth2 } from '@n8n/client-oauth2';
import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	JsonObject,
	IHttpRequestOptions,
	IHttpRequestMethods,
	ICredentialDataDecryptedObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

import get from 'lodash/get';

const API_URL: string = 'https://api.deezer.com';

/**
 * Make an API request to Deezer
 *
 */
export async function deezerApiRequest(
	this: IHookFunctions | IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: object,
	query?: IDataObject,
	uri?: string,
): Promise<any> {
	const requestOptions: IHttpRequestOptions = {
		method,
		headers: {
			'User-Agent': 'n8n',
			'Content-Type': 'text/plain',
			Accept: ' application/json',
		},
		qs: query,
		url: uri || API_URL + endpoint,
		json: true,
	};

	if (Object.keys(body).length > 0) {
		requestOptions.body = body;
	}
	try {
		const credentials = (await this.getCredentials(
			'deezerOAuth2Api',
		)) as ICredentialDataDecryptedObject;

		const oAuthClient = new ClientOAuth2({
			clientId: credentials.clientId,
			clientSecret: credentials.clientSecret,
			accessTokenUri: credentials.accessTokenUrl,
			scopes: (credentials.scope as string).split(' '),
			ignoreSSLIssues: credentials.ignoreSSLIssues,
			authentication: credentials.authentication ?? 'header',
		} as ClientOAuth2Options);

		const oauthTokenData = credentials.oauthTokenData as ClientOAuth2TokenData;
		const token = oAuthClient.createToken(oauthTokenData);

		requestOptions.qs = { ...requestOptions.qs, access_token: token.accessToken };

		return await this.helpers.httpRequest(requestOptions);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function deezerApiRequestAllItems(
	this: IHookFunctions | IExecuteFunctions,
	propertyName: string,
	method: IHttpRequestMethods,
	endpoint: string,
	body: object,
	query?: IDataObject,
): Promise<any> {
	const returnData: IDataObject[] = [];

	let responseData;

	let uri: string | undefined;

	do {
		responseData = await deezerApiRequest.call(this, method, endpoint, body, query, uri);

		returnData.push.apply(returnData, get(responseData, propertyName));
		uri = responseData.next || responseData[propertyName.split('.')[0]].next;
		//remove the query as the query parameters are already included in the next, else api throws error.
		query = {};
		if (uri?.includes('offset=1000') && endpoint === '/search') {
			// The search endpoint has a limit of 1000 so step before it returns a 404
			return returnData;
		}
	} while (
		(responseData.next !== null && responseData.next !== undefined) ||
		(responseData[propertyName.split('.')[0]].next !== null &&
			responseData[propertyName.split('.')[0]].next !== undefined)
	);

	return returnData;
}
