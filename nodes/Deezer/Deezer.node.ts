import {
	type IExecuteFunctions,
	type IDataObject,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type IHttpRequestOptions,
	type ICredentialDataDecryptedObject,
} from 'n8n-workflow';
import {
	type ClientOAuth2Options,
	type ClientOAuth2TokenData,
	ClientOAuth2,
} from '@n8n/client-oauth2';

import calls from './crud';
import { merge } from 'lodash';

const API_URL: string = 'https://api.deezer.com';

const baseRequestOptions: IHttpRequestOptions = {
	baseURL: API_URL,
	headers: {
		'User-Agent': 'n8n',
		'Content-Type': 'text/plain',
		Accept: ' application/json',
	},
	qs: {},
	json: true,
	url: '',
};

const getAccessToken = async function (credentials: ICredentialDataDecryptedObject): Promise<any> {
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

	return token.accessToken;
};

export class Deezer implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Deezer',
		name: 'deezer',
		icon: 'file:deezer.svg',
		group: ['input'],
		version: 1,
		description: 'Access public song data via the Deezer API',
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		defaults: {
			name: 'Deezer',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'deezerOAuth2Api',
				required: true,
			},
		],
		properties: [
			// ----------------------------------------------------------------
			//         Resource to Operate on
			// ----------------------------------------------------------------
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Album', value: 'album' },
					{ name: 'Artist', value: 'artist' },
					{ name: 'Playlist', value: 'playlist' },
					{ name: 'Track', value: 'track' },
					{ name: 'Chart', value: 'chart' },
					{ name: 'User', value: 'user' },
					{ name: 'Podcast', value: 'podcast' },
				],
				default: 'player',
			},

			// -----------------------------------------------
			//         Album Operations
			// -----------------------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['album'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get an album by ID',
						action: 'Get an album',
					},
					{
						name: 'Get Tracks',
						value: 'getTracks',
						description: "Get an album's tracks by ID",
						action: "Get an album's tracks by ID",
					},
					{
						name: 'Get Fans',
						value: 'getFans',
						description: "Get a list of album's fans. Represented by an array of User objects",
						action: "Get a list of album's fans",
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search albums by keyword',
						action: 'Search albums by keyword',
					},
				],
				default: 'get',
			},
			// ----------------------------------------------------------------
			//         Artist Operations
			// ----------------------------------------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['artist'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get an artist by ID',
						action: 'Get an artist',
					},
					{
						name: 'Get Albums',
						value: 'getAlbums',
						description: "Get an artist's albums by ID",
						action: "Get an artist's albums by ID",
					},
					{
						name: 'Get Related Artists',
						value: 'getRelatedArtists',
						description: "Get an artist's related artists by ID",
						action: "Get an artist's related artists by ID",
					},
					{
						name: 'Get Top Tracks',
						value: 'getTopTracks',
						description: "Get an artist's top tracks by ID",
						action: "Get an artist's top tracks by ID",
					},
					{
						name: 'Get Playlist',
						value: 'getPlaylists',
						description: 'Get artist playlists by ID',
						action: 'Get artist playlists by ID',
					},
					{
						name: 'Get Fans',
						value: 'getFans',
						description: 'Get artist fans by ID',
						action: 'Get artist fans by ID',
					},
					{
						name: 'Get Radio',
						value: 'getRadio',
						description: 'Get artist radio by ID',
						action: 'Get artist radio by ID',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search artists by keyword',
						action: 'Search artists by keyword',
					},
				],
				default: 'get',
			},
			// -----------------------------------------------------
			//         Playlist Operations
			// -----------------------------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['playlist'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a playlist by ID',
						action: 'Get a playlist',
					},
					{
						name: 'Create a Playlist',
						value: 'create',
						description: 'Create a new playlist',
						action: 'Create a playlist',
					},
					{
						name: 'Delete a Playlist',
						value: 'delete',
						description: 'Delete a playlist',
						action: 'Delete a playlist',
					},
					{
						name: 'Get Fans',
						value: 'getFans',
						description: 'Get artist fans by ID',
						action: 'Get artist fans by ID',
					},
					{
						name: 'Get Tracks',
						value: 'getTracks',
						description: "Get a playlist's tracks by ID",
						action: "Get a playlist's tracks by ID",
					},
					{
						name: 'Add an Tracks',
						value: 'add',
						description: 'Add tracks to a playlist by track and playlist ID',
						action: 'Add an Item to a playlist',
					},
					{
						name: 'Remove an Track',
						value: 'remove',
						description: 'Remove tracks from a playlist by track and playlist ID',
						action: 'Remove an item from a playlist',
					},
					{
						name: 'Get Radio',
						value: 'getRadio',
						description: "Return a list of playlist's recommendation tracks.",
						action: "Return a list of playlist's recommendation tracks.",
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search playlists by keyword',
						action: 'Search playlists by keyword',
					},
				],
				default: 'get',
			},
			// -----------------------------------------------------
			//         Track Operations
			// -----------------------------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['track'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a track by its ID',
						action: 'Get a track',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search tracks by keyword',
						action: 'Search tracks by keyword',
					},
				],
				default: 'get',
			},
			// ---------------------------------------
			//         Chart Operations
			// ---------------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['chart'],
					},
				},
				options: [
					{
						name: 'Get All',
						value: 'get',
						description: '',
						action: '',
					},
					{
						name: 'Get Artists',
						value: 'getArtists',
						description: '',
						action: '',
					},
					{
						name: 'Get Albums',
						value: 'getAlbums',
						description: '',
						action: '',
					},
					{
						name: 'Get Tracks',
						value: 'getTracks',
						description: '',
						action: '',
					},
					{
						name: 'Get Playlists',
						value: 'getPlaylists',
						description: '',
						action: '',
					},
					{
						name: 'Get Podcasts',
						value: 'getPodcasts',
						description: '',
						action: '',
					},
				],
				default: 'get',
			},
			// ---------------------------------------
			//         User Operations
			// ---------------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['user'],
					},
				},
				options: [
					{
						name: 'Get User',
						value: 'get',
						description: '',
						action: '',
					},
					{
						name: 'Get Playlists',
						value: 'getPlaylists',
						description: '',
						action: '',
					},
					{
						name: 'Get Favorite Tracks',
						value: 'getFavoriteTracks',
						description: '',
						action: '',
					},
					{
						name: 'Get Favorite Albums',
						value: 'getFavoriteAlbums',
						description: '',
						action: '',
					},
					{
						name: 'Get Favorite Artists',
						value: 'getFavoriteArtists',
						description: '',
						action: '',
					},
					{
						name: 'Get Favorite Podcasts',
						value: 'getFavoritePodcasts',
						description: '',
						action: '',
					},
					{
						name: 'Get Favorite Radios',
						value: 'getFavoriteRadios',
						description: '',
						action: '',
					},
					{
						name: 'Get Flow',
						value: 'getFlow',
						description: '',
						action: '',
					},
					{
						name: 'Get Followings',
						value: 'getFollowings',
						description: '',
						action: '',
					},
					{
						name: 'Get Followers',
						value: 'getFollowers',
						description: '',
						action: '',
					},
					{
						name: 'Get Recent Tracks',
						value: 'getRecentTracks',
						description: '',
						action: '',
					},
				],
				default: 'get',
			},
			// ---------------------------------------
			//         Podcast Operations
			// ---------------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['podcast'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: '',
						action: '',
					},
					{
						name: 'Get Episodes',
						value: 'getEpisodes',
						description: '',
						action: '',
					},
					{
						name: 'Search',
						value: 'search',
						description: '',
						action: '',
					},
				],
				default: 'get',
			},
			// -----------------------------------------------------
			//         Commons
			// -----------------------------------------------------
			{
				displayName: 'Resource ID',
				name: 'id',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['album', 'artist', 'playlist', 'track', 'podcast'],
					},
					hide: {
						operation: ['search'],
					},
				},
				placeholder: '1234567',
				description: 'Resource ID',
			},
			{
				displayName: 'Search Keyword',
				name: 'query',
				type: 'string',
				required: true,
				default: '',
				description: 'The keyword term to search for',
				displayOptions: {
					show: {
						resource: ['album', 'artist', 'playlist', 'track', 'podcast'],
						operation: ['search'],
					},
				},
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['playlist'],
						operation: ['create'],
					},
				},
				placeholder: 'Favorite Songs',
				description: 'Name of the playlist to create',
			},
			{
				displayName: 'Track ID',
				name: 'trackID',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['playlist'],
						operation: ['add', 'remove'],
					},
				},
				placeholder: 'Favorite Songs',
				description: 'Name of the playlist to create',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				required: true,
				displayOptions: {
					show: {
						resource: ['album', 'artist', 'playlist', 'track', 'chart', 'user', 'podcast'],
					},
					hide: {
						operation: ['get'],
					},
				},
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				default: 0,
				required: true,
				displayOptions: {
					show: {
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 0,
				},
				description: 'The offset of the first object you want to get.',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				required: true,
				displayOptions: {
					show: {
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				description: 'The maximum number of objects to return.',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Get all of the incoming input data to loop through
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const operation = this.getNodeParameter('operation', 0);
		const resource = this.getNodeParameter('resource', 0);

		const credentials = (await this.getCredentials(
			'deezerOAuth2Api',
		)) as ICredentialDataDecryptedObject;

		baseRequestOptions.qs = { access_token: await getAccessToken(credentials) };

		for (let i = 0; i < items.length; i++) {
			try {
				const requestOptions: IHttpRequestOptions = await calls[resource][operation](this, i);

				const responseData = await this.helpers.httpRequest(
					merge(baseRequestOptions, requestOptions) as IHttpRequestOptions,
				);

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as IDataObject[]),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: error.message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
