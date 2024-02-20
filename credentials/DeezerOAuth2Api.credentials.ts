import type {
	ICredentialType,
	INodeProperties,
	IAuthenticateGeneric,
	// IDataObject,
} from 'n8n-workflow';

export class DeezerOAuth2Api implements ICredentialType {
	name = 'deezerOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'Deezer OAuth2 API';

	documentationUrl = 'deezer';

	properties: INodeProperties[] = [
		{
			displayName: 'Deezer Server',
			name: 'server',
			type: 'string',
			default: 'https://api.deezer.com/',
		},
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'string',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'string',
			default: 'https://connect.deezer.com/oauth/auth.php',
			required: true,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'string',
			default: 'https://connect.deezer.com/oauth/access_token.php',
			required: true,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'string',
			default: 'basic_access,email',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'string',
			default: 'output=json',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'string',
			default: 'body',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			qs: {
				// Send this as part of the query string
				access_token: '={{ $credentials.oauthTokenData["access_token"] }}',
			},
		},
	};
}
