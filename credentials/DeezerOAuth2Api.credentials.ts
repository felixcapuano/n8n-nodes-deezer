import type { ICredentialType, INodeProperties } from 'n8n-workflow';

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
			default: 'https://connect.deezer.com',
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
			default: '={{$self["server"]}}/oauth/auth.php',
			required: true,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: '={{$self["server"]}}/oauth/access_token.php',
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
			default: 'output=json',
		},
		{
			displayName: 'Authentication',
			name: 'authentication',
			type: 'hidden',
			default: 'body',
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'hidden',
			default: '={{$self["oauthTokenData"]["access_token"]}}',
		},
	];
}
