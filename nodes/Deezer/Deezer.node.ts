import {
	type IExecuteFunctions,
	type IDataObject,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type IHttpRequestOptions,
} from 'n8n-workflow';
import { merge } from 'lodash';

import crud from './DeezerRequestBuilder';
import { getAccessToken, requestDeezer } from './GenericFunctions';

const BASE_URL = 'https://api.deezer.com';
const DEFAULT_OFFSET = 0;
const DEFAULT_LIMIT = 50;

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
						description: 'Search tracks by keyword',
						action: 'Search tracks by keyword',
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
						description: 'Search tracks by keyword',
						action: 'Search tracks by keyword',
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
						description: 'Search tracks by keyword',
						action: 'Search tracks by keyword',
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
						action: 'Get a podcast',
					},
					{
						name: 'Get Episodes',
						value: 'getEpisodes',
						action: 'Get podcast episodes',
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
						action: 'Get popular albums',
					},
					{
						name: 'Get All',
						value: 'get',
						action: 'Get chart',
					},
					{
						name: 'Get Artists',
						value: 'getArtists',
						action: 'Get popular artists',
					},
					{
						name: 'Get Playlists',
						value: 'getPlaylists',
						action: 'Get popular playlists',
					},
					{
						name: 'Get Podcasts',
						value: 'getPodcasts',
						action: 'Get popular podcasts',
					},
					{
						name: 'Get Tracks',
						value: 'getTracks',
						action: 'Get popular tracks',
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
						name: 'Get',
						value: 'get',
						action: 'Get user',
					},
					{
						name: 'Get Favorite Albums',
						value: 'getFavoriteAlbums',
						action: 'Get a user s favorite albums from a user',
					},
					{
						name: 'Get Favorite Artists',
						value: 'getFavoriteArtists',
						action: 'Get a user s favorite artists',
					},
					{
						name: 'Get Favorite Podcasts',
						value: 'getFavoritePodcasts',
						action: 'Get a user s favorite podcasts',
					},
					{
						name: 'Get Favorite Radios',
						value: 'getFavoriteRadios',
						action: 'Get a user s favorite radios',
					},
					{
						name: 'Get Favorite Tracks',
						value: 'getFavoriteTracks',
						action: 'Get a user s favorite tracks',
					},
					{
						name: 'Get Flow',
						value: 'getFlow',
						action: 'Get a user s flow',
					},
					{
						name: 'Get Followers',
						value: 'getFollowers',
						action: 'Get a user s followers',
					},
					{
						name: 'Get Followings',
						value: 'getFollowings',
						action: 'Get a user s followings',
					},
					{
						name: 'Get Playlists',
						value: 'getPlaylists',
						action: 'Get a user s playlists',
					},
					{
						name: 'Get Recent Tracks',
						value: 'getRecentTracks',
						action: 'Get tracks recently listened to by a user',
					},
				],
				default: 'get',
			},
			// -----------------------------------------------------
			//         Commons
			// -----------------------------------------------------
			{
				displayName: 'Return My User',
				name: 'returnMyUser',
				type: 'boolean',
				default: true,
				required: true,
				displayOptions: {
					show: {
						resource: ['user'],
					},
				},
				description: 'Whether to return the logged in user or a specific user',
			},
			{
				displayName: 'Resource ID',
				name: 'id',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['album', 'artist', 'playlist', 'track', 'podcast', 'user'],
					},
					hide: {
						operation: ['search'],
						returnMyUser: [true],
					},
				},
				placeholder: '1234567',
			},
			{
				displayName: 'Search',
				placeholder: 'Keyword',
				required: true,
				name: 'keyword',
				type: 'string',
				default: '',
				description: 'The keyword term to search for',
				displayOptions: {
					show: {
						resource: ['track', 'album', 'playlist', 'podcast', 'artist'],
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
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filters',
				default: {},
				displayOptions: {
					show: {
						resource: ['track', 'album', 'playlist', 'podcast', 'artist'],
						operation: ['search'],
					},
				},
				options: [
					{
						displayName: 'With Artist',
						name: 'artist',
						type: 'string',
						typeOptions: {
							multipleValues: false,
						},
						default: '',
					},
					{
						displayName: 'With Album',
						name: 'album',
						type: 'string',
						required: true,
						typeOptions: {
							multipleValues: false,
						},
						default: '',
					},
					{
						displayName: 'With Track',
						name: 'track',
						type: 'string',
						typeOptions: {
							multipleValues: false,
						},
						default: '',
					},
					{
						displayName: 'With Label',
						name: 'label',
						type: 'string',
						typeOptions: {
							multipleValues: false,
						},
						default: '',
					},
					{
						displayName: 'With Duration Minimum',
						name: 'dur_min',
						type: 'number',
						typeOptions: {
							multipleValues: false,
						},
						default: 0,
					},
					{
						displayName: 'With Duration Maximum',
						name: 'dur_max',
						type: 'number',
						typeOptions: {
							multipleValues: false,
						},
						default: 999,
					},
					{
						displayName: 'With Tempo(BPM) Minimum',
						name: 'bpm_min',
						type: 'number',
						typeOptions: {
							multipleValues: false,
						},
						default: 0,
					},
					{
						displayName: 'With Tempo(BPM) Maximum',
						name: 'bpm_max',
						type: 'number',
						typeOptions: {
							multipleValues: false,
						},
						default: 999,
					},
				],
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

		const baseRequestOptions: IHttpRequestOptions = {
			baseURL: BASE_URL,
			headers: {
				'User-Agent': 'n8n',
				'Content-Type': 'text/plain',
				Accept: ' application/json',
			},
			qs: {},
			json: true,
			url: '',
		};

		request = merge(baseRequestOptions, { qs: { access_token: accessToken } });

		const returnAll = this.getNodeParameter('returnAll', 0, false);
		const offset = this.getNodeParameter('offset', 0, DEFAULT_OFFSET);
		const limit = this.getNodeParameter('limit', 0, DEFAULT_LIMIT);

		request = merge(request, { qs: { index: offset, limit: limit } });

		for (let i = 0; i < items.length; i++) {
			try {
				const operationRequest: IHttpRequestOptions = await crud[resource][operation](this, i);

				request = merge(request, operationRequest);

				let responseData = await requestDeezer(this, request, returnAll);

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
