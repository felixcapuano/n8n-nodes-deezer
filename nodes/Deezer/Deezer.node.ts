import {
	type IExecuteFunctions,
	type IDataObject,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type IHttpRequestOptions,
} from 'n8n-workflow';
import { merge } from 'lodash';

import crud from './crud';
import { getAccessToken } from './GenericFunctions';

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
					{
						name: 'Album',
						value: 'album',
					},
					{
						name: 'Artist',
						value: 'artist',
					},
					{
						name: 'Chart',
						value: 'chart',
					},
					{
						name: 'Playlist',
						value: 'playlist',
					},
					{
						name: 'Podcast',
						value: 'podcast',
					},
					{
						name: 'Track',
						value: 'track',
					},
					{
						name: 'User',
						value: 'user',
					},
				],
				default: 'album',
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
						action: 'Get an album s tracks by id',
					},
					{
						name: 'Get Fans',
						value: 'getFans',
						description: "Get a list of album's fans. Represented by an array of User objects.",
						action: 'Get a list of album s fans',
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
						action: 'Get an artist s albums by id',
					},
					{
						name: 'Get Fans',
						value: 'getFans',
						description: 'Get artist fans by ID',
						action: 'Get artist fans by ID',
					},
					{
						name: 'Get Playlist',
						value: 'getPlaylists',
						description: 'Get artist playlists by ID',
						action: 'Get artist playlists by ID',
					},
					{
						name: 'Get Radio',
						value: 'getRadio',
						description: 'Get artist radio by ID',
						action: 'Get artist radio by ID',
					},
					{
						name: 'Get Related Artists',
						value: 'getRelatedArtists',
						description: "Get an artist's related artists by ID",
						action: 'Get an artist s related artists by id',
					},
					{
						name: 'Get Top Tracks',
						value: 'getTopTracks',
						description: "Get an artist's top tracks by ID",
						action: 'Get an artist s top tracks by id',
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
						name: 'Add an Tracks',
						value: 'add',
						description: 'Add tracks to a playlist by track and playlist ID',
						action: 'Add an item to a playlist',
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
						action: 'Delete a playlist',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a playlist by ID',
						action: 'Get a playlist',
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
						description: "Return a list of playlist's recommendation tracks",
						action: 'Return a list of playlist s recommendation tracks',
					},
					{
						name: 'Get Tracks',
						value: 'getTracks',
						description: "Get a playlist's tracks by ID",
						action: 'Get a playlist s tracks by id',
					},
					{
						name: 'Remove an Track',
						value: 'remove',
						description: 'Remove tracks from a playlist by track and playlist ID',
						action: 'Remove an item from a playlist',
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
						name: 'Get Albums',
						value: 'getAlbums',
						action: '',
					},
					{
						name: 'Get All',
						value: 'get',
						action: '',
					},
					{
						name: 'Get Artists',
						value: 'getArtists',
						action: '',
					},
					{
						name: 'Get Playlists',
						value: 'getPlaylists',
						action: '',
					},
					{
						name: 'Get Podcasts',
						value: 'getPodcasts',
						action: '',
					},
					{
						name: 'Get Tracks',
						value: 'getTracks',
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
						name: 'Get Favorite Albums',
						value: 'getFavoriteAlbums',
						action: '',
					},
					{
						name: 'Get Favorite Artists',
						value: 'getFavoriteArtists',
						action: '',
					},
					{
						name: 'Get Favorite Podcasts',
						value: 'getFavoritePodcasts',
						action: '',
					},
					{
						name: 'Get Favorite Radios',
						value: 'getFavoriteRadios',
						action: '',
					},
					{
						name: 'Get Favorite Tracks',
						value: 'getFavoriteTracks',
						action: '',
					},
					{
						name: 'Get Flow',
						value: 'getFlow',
						action: '',
					},
					{
						name: 'Get Followers',
						value: 'getFollowers',
						action: '',
					},
					{
						name: 'Get Followings',
						value: 'getFollowings',
						action: '',
					},
					{
						name: 'Get Playlists',
						value: 'getPlaylists',
						action: '',
					},
					{
						name: 'Get Recent Tracks',
						value: 'getRecentTracks',
						action: '',
					},
					{
						name: 'Get User',
						value: 'get',
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
						action: '',
					},
					{
						name: 'Get Episodes',
						value: 'getEpisodes',
						action: '',
					},
					{
						name: 'Search',
						value: 'search',
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
				displayName: 'Order',
				name: 'order',
				type: 'options',
				required: true,
				default: 'RANKING',
				options: [
					{
						name: 'Album Ascendent',
						value: 'ALBUM_ASC',
					},
					{
						name: 'Album Descendent',
						value: 'ALBUM_DESC',
					},
					{
						name: 'Artist Ascendent',
						value: 'ARTIST_ASC',
					},
					{
						name: 'Artist Descendent',
						value: 'ARTIST_DESC',
					},
					{
						name: 'Duration Ascendent',
						value: 'DURATION_ASC',
					},
					{
						name: 'Duration Descendent',
						value: 'DURATION_DESC',
					},
					{
						name: 'Ranking',
						value: 'RANKING',
					},
					{
						name: 'Rating Ascendent',
						value: 'RATING_ASC',
					},
					{
						name: 'Rating Descendent',
						value: 'RATING_DESC',
					},
					{
						name: 'Track Ascendent',
						value: 'TRACK_ASC',
					},
					{
						name: 'Track Descendent',
						value: 'TRACK_DESC',
					},
				],
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
				description: 'The offset of the first object you want to get',
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
				},
				description: 'Max number of results to return',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Get all of the incoming input data to loop through
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		let request: IHttpRequestOptions;

		const operation = this.getNodeParameter('operation', 0);
		const resource = this.getNodeParameter('resource', 0);

		const credentials = await this.getCredentials('deezerOAuth2Api');
		const accessToken = await getAccessToken(credentials);

		request = merge(baseRequestOptions, { qs: { access_token: accessToken } });

		const returnAll = this.getNodeParameter('returnAll', 0, true);
		if (!returnAll) {
			const offset = this.getNodeParameter('offset', 0);
			const limit = this.getNodeParameter('limit', 0);

			request = merge(request, { qs: { index: offset, limit: limit } });
		}

		for (let i = 0; i < items.length; i++) {
			try {
				const operationRequest: IHttpRequestOptions = await crud[resource][operation](this, i);

				request = merge(request, operationRequest);

				let responseData = await this.helpers.httpRequest(request);

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
