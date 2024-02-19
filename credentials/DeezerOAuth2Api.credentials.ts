import type { ICredentialType, INodeProperties, IAuthenticateGeneric } from 'n8n-workflow';

export class DeezerOAuth2Api implements ICredentialType {
	name = 'deezerOAuth2Api';

	extends = ['oAuth2Api'];

	displayName = 'Deezer OAuth2 API';

	documentationUrl = 'deezer';

	properties: INodeProperties[] = [
		{
			displayName: 'Deezer Server',
			name: 'server',
			type: 'hidden',
			default: 'https://api.deezer.com/',
		},
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: 'https://connect.deezer.com/oauth/auth.php',
			required: true,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: 'https://connect.deezer.com/oauth/access_token.php',
			required: true,
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'basic_access,email',
		},
		{
			displayName: 'Auth URI Query Parameters',
			name: 'authQueryParameters',
			type: 'hidden',
			default: '',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'qs',
		},
		{
			displayName: 'Access Token',
			name: 'access_token',
			type: 'hidden',
			default: 'fake_token',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			qs: {
				// Send this as part of the query string
				access_token: '{{ $credentials.access_token }}',
			},
		},
	};
}
