import type { ClientOAuth2Options, ClientOAuth2TokenData } from '@n8n/client-oauth2';
import { ClientOAuth2 } from '@n8n/client-oauth2';
import type {
	IExecuteFunctions,
	IHttpRequestOptions,
	ICredentialDataDecryptedObject,
	IDataObject,
} from 'n8n-workflow';

import merge from 'lodash/merge';

export async function getAccessToken(credentials: ICredentialDataDecryptedObject): Promise<string> {
	// Create a new OAuth client with the provided credentials
	const oAuthClient = new ClientOAuth2({
		clientId: credentials.clientId,
		clientSecret: credentials.clientSecret,
		accessTokenUri: credentials.accessTokenUrl,
		scopes: (credentials.scope.toString() as string).split(' '),
		ignoreSSLIssues: credentials.ignoreSSLIssues,
		authentication: credentials.authentication ?? 'header',
	} as ClientOAuth2Options);

	// Extract OAuth token data from credentials
	const oauthTokenData = credentials.oauthTokenData as ClientOAuth2TokenData;

	// Create a token using the OAuth client and provided token data
	const token = oAuthClient.createToken(oauthTokenData);

	// Return the access token from the token object
	return token.accessToken;
}

export async function requestDeezer(
	excf: IExecuteFunctions,
	request: IHttpRequestOptions,
	all: boolean = true,
): Promise<any> {
	// Make the initial request
	const response = await excf.helpers.httpRequest(request);

	// If 'all' is true, fetch additional data
	if (all) {
		let nextURL = new URL(response.next);

		// Continue fetching until no more 'next' URLs or data exceeds 1000 items
		while (true) {
			// Create a new request based on the 'next' URL
			const nextRequest = merge(request, {
				url: nextURL.pathname,
				qs: Object.fromEntries(nextURL.searchParams),
			});

			// Make the next request
			const nextResponse = await excf.helpers.httpRequest(nextRequest);

			// Append the data from the next response to the original response
			response.data.push(...nextResponse.data);

			// Check if there are more pages of data
			if (!nextResponse.next) {
				delete response.next; // No more pages, remove 'next' property
				break;
			}

			// Check if the total data exceeds 1000 items
			if (response.data.length > 1000) {
				response.next = nextResponse.next; // Store 'next' URL for potential future requests
				break;
			}

			// Update the 'next' URL for the next iteration
			nextURL = new URL(nextResponse.next);
		}
	}

	// Return the combined response
	return response;
}

export function buildDeezerSearchQuery(keyword: String, filters: IDataObject): String {
	let query = keyword.toString();

	for (let [key, value] of Object.entries(filters)) {
		query += ` ${key}:"${value}"`;
	}

	return query;
}
