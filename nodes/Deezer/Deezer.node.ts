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
			//         Album, Artist, Library, My Data, Player, Playlist, Track
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
					// { name: 'Track', value: 'track' },
					// { name: 'Chart', value: 'chart' },

					// { name: 'Library', value: 'library' },
					// { name: 'My Data', value: 'myData' },
					// { name: 'Player', value: 'player' },
				],
				default: 'player',
			},

			// --------------------------------------------------------------------------------------------------------
			//         Player Operations
			//         Pause, Play, Resume, Get Recently Played, Get Currently Playing, Next Song, Previous Song,
			//         Add to Queue, Set Volume
			// --------------------------------------------------------------------------------------------------------
			// {
			// 	displayName: 'Operation',
			// 	name: 'operation',
			// 	type: 'options',
			// 	noDataExpression: true,
			// 	displayOptions: {
			// 		show: {
			// 			resource: ['player'],
			// 		},
			// 	},
			// 	options: [
			// 		{
			// 			name: 'Add Song to Queue TODO',
			// 			value: 'addSongToQueue',
			// 			description: 'Add a song to your queue',
			// 			action: 'Add a song to a queue',
			// 		},
			// 		{
			// 			name: 'Currently Playing TODO',
			// 			value: 'currentlyPlaying',
			// 			description: 'Get your currently playing track',
			// 			action: 'Get the currently playing track',
			// 		},
			// 		{
			// 			name: 'Next Song TODO',
			// 			value: 'nextSong',
			// 			description: 'Skip to your next track',
			// 			action: 'Skip to the next track',
			// 		},
			// 		{
			// 			name: 'Pause TODO',
			// 			value: 'pause',
			// 			description: 'Pause your music',
			// 			action: 'Pause the player',
			// 		},
			// 		{
			// 			name: 'Previous Song TODO',
			// 			value: 'previousSong',
			// 			description: 'Skip to your previous song',
			// 			action: 'Skip to the previous song',
			// 		},
			// 		{
			// 			name: 'Recently Played TODO',
			// 			value: 'recentlyPlayed',
			// 			description: 'Get your recently played tracks',
			// 			action: 'Get the recently played tracks',
			// 		},
			// 		{
			// 			name: 'Resume TODO',
			// 			value: 'resume',
			// 			description: 'Resume playback on the current active device',
			// 			action: 'Resume the player',
			// 		},
			// 		{
			// 			name: 'Set Volume TODO',
			// 			value: 'volume',
			// 			description: 'Set volume on the current active device',
			// 			action: 'Set volume on the player',
			// 		},
			// 		{
			// 			name: 'Start Music TODO',
			// 			value: 'startMusic',
			// 			description: 'Start playing a playlist, artist, or album',
			// 			action: 'Start music on the player',
			// 		},
			// 	],
			// 	default: 'addSongToQueue',
			// },
			// {
			// 	displayName: 'Resource ID',
			// 	name: 'id',
			// 	type: 'string',
			// 	default: '',
			// 	required: true,
			// 	displayOptions: {
			// 		show: {
			// 			resource: ['player'],
			// 			operation: ['startMusic'],
			// 		},
			// 	},
			// 	placeholder: '1234567',
			// 	description: 'Enter a playlist, artist, or album ID',
			// },
			// {
			// 	displayName: 'Track ID',
			// 	name: 'id',
			// 	type: 'string',
			// 	default: '',
			// 	required: true,
			// 	displayOptions: {
			// 		show: {
			// 			resource: ['player'],
			// 			operation: ['addSongToQueue'],
			// 		},
			// 	},
			// 	placeholder: '1234567',
			// 	description: 'Enter a track ID',
			// },

			// -----------------------------------------------
			//         Album Operations
			//         Get an Album, Get an Album's Tracks
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
			{
				displayName: 'Album ID',
				name: 'id',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['album'],
						operation: ['get', 'getTracks'],
					},
					hide: {
						operation: ['search'],
					},
				},
				placeholder: '1234567',
				description: "The album's Deezer ID",
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
						resource: ['album'],
						operation: ['search'],
					},
				},
			},

			// -------------------------------------------------------------------------------------------------------------
			//         Artist Operations
			//         Get an Artist, Get an Artist's Related Artists, Get an Artist's Top Tracks, Get an Artist's Albums
			// -------------------------------------------------------------------------------------------------------------
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
						name: 'Get Albums TODO',
						value: 'getAlbums',
						description: "Get an artist's albums by ID",
						action: "Get an artist's albums by ID",
					},
					{
						name: 'Get Related Artists TODO',
						value: 'getRelatedArtists',
						description: "Get an artist's related artists by ID",
						action: "Get an artist's related artists by ID",
					},
					{
						name: 'Get Top Tracks TODO',
						value: 'getTopTracks',
						description: "Get an artist's top tracks by ID",
						action: "Get an artist's top tracks by ID",
					},
					{
						name: 'Get Playlist TODO',
						value: 'getPlaylists',
						description: 'Get artist playlists by ID',
						action: 'Get artist playlists by ID',
					},
					{
						name: 'Get Fans TODO',
						value: 'getFans',
						description: 'Get artist fans by ID',
						action: 'Get artist fans by ID',
					},
					{
						name: 'Get Radio TODO',
						value: 'getRadio',
						description: 'Get artist radio by ID',
						action: 'Get artist radio by ID',
					},
					{
						name: 'Search TODO',
						value: 'search',
						description: 'Search artists by keyword',
						action: 'Search artists by keyword',
					},
				],
				default: 'get',
			},
			{
				displayName: 'Artist ID',
				name: 'id',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['artist'],
					},
					hide: {
						operation: ['search'],
					},
				},
				placeholder: '1234567',
				description: "The artist's Deezer ID",
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: 'US',
				required: true,
				displayOptions: {
					show: {
						resource: ['artist'],
						operation: ['getTopTracks'],
					},
				},
				placeholder: 'US',
				description: 'Top tracks in which country? Enter the postal abbreviation',
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
						resource: ['artist'],
						operation: ['search'],
					},
				},
			},

			// -------------------------------------------------------------------------------------------------------------
			//         Playlist Operations
			//         Get a Playlist, Get a Playlist's Tracks, Add/Remove a Song from a Playlist, Get a User's Playlists
			// -------------------------------------------------------------------------------------------------------------
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
						name: "Get the User's Playlists",
						value: 'getUserPlaylists',
						description: "Get a user's playlists",
						action: "Get a user's playlists",
					},
					{
						name: 'Create a Playlist',
						value: 'create',
						description: 'Create a new playlist',
						action: 'Create a playlist',
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
						name: 'Search',
						value: 'search',
						description: 'Search playlists by keyword',
						action: 'Search playlists by keyword',
					},
				],
				default: 'add',
			},
			{
				displayName: 'Playlist ID',
				name: 'id',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['playlist'],
						operation: ['add', 'remove', 'get', 'getTracks'],
					},
				},
				placeholder: '12345647',
				description: "The playlist's Deezer ID",
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
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['playlist'],
						operation: ['create'],
					},
				},
				options: [
					{
						displayName: 'Description',
						name: 'description',
						type: 'string',
						default: '',
						placeholder: 'These are all my favorite songs.',
						description: 'Description for the playlist to create',
					},
					{
						displayName: 'Public',
						name: 'public',
						type: 'boolean',
						default: true,
						description: 'Whether the playlist is publicly accessible',
					},
				],
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
				placeholder: '1234567',
				description: "The track's Deezer ID. The track to add/remove from the playlist.",
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				displayOptions: {
					show: {
						resource: ['playlist'],
						operation: ['add'],
					},
				},
				options: [
					{
						displayName: 'Position',
						name: 'position',
						type: 'number',
						typeOptions: {
							minValue: 0,
						},
						default: 0,
						placeholder: '0',
						description: "The new track's position in the playlist",
					},
				],
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
						resource: ['playlist'],
						operation: ['search'],
					},
				},
			},

			// -----------------------------------------------------
			//         Track Operations
			//         Get a Track, Get a Track's Audio Features
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
						name: 'Get TODO',
						value: 'get',
						description: 'Get a track by its ID',
						action: 'Get a track',
					},
					{
						name: 'Get Audio Features TODO',
						value: 'getAudioFeatures',
						description: 'Get audio features for a track by ID',
						action: 'Get audio features of a track',
					},
					{
						name: 'Search TODO',
						value: 'search',
						description: 'Search tracks by keyword',
						action: 'Search tracks by keyword',
					},
				],
				default: 'track',
			},
			{
				displayName: 'Track ID',
				name: 'id',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['track'],
					},
					hide: {
						operation: ['search'],
					},
				},
				placeholder: '1234567',
				description: "The track's Deezer ID",
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
						resource: ['track'],
						operation: ['search'],
					},
				},
			},

			// -----------------------------------------------------
			//         Library Operations
			//         Get liked tracks
			// -----------------------------------------------------
			// {
			// 	displayName: 'Operation',
			// 	name: 'operation',
			// 	type: 'options',
			// 	noDataExpression: true,
			// 	displayOptions: {
			// 		show: {
			// 			resource: ['library'],
			// 		},
			// 	},
			// 	options: [
			// 		{
			// 			name: 'Get Liked Tracks TODO',
			// 			value: 'getLikedTracks',
			// 			description: "Get the user's liked tracks",
			// 			action: 'Get liked tracks',
			// 		},
			// 	],
			// 	default: 'getLikedTracks',
			// },

			// ---------------------------------------
			//         My Data Operations
			//         Get Followed Artists
			// ---------------------------------------
			// {
			// 	displayName: 'Operation',
			// 	name: 'operation',
			// 	type: 'options',
			// 	noDataExpression: true,
			// 	displayOptions: {
			// 		show: {
			// 			resource: ['myData'],
			// 		},
			// 	},
			// 	options: [
			// 		{
			// 			name: 'Get Following Artists TODO',
			// 			value: 'getFollowingArtists',
			// 			description: 'Get your followed artists',
			// 			action: 'Get your followed artists',
			// 		},
			// 	],
			// 	default: 'getFollowingArtists',
			// },
			// {
			// 	displayName: 'Return All',
			// 	name: 'returnAll',
			// 	type: 'boolean',
			// 	default: false,
			// 	required: true,
			// 	displayOptions: {
			// 		show: {
			// 			resource: ['album', 'artist', 'library', 'myData', 'playlist', 'track', 'player'],
			// 			operation: [
			// 				'getTracks',
			// 				'getAlbums',
			// 				'getUserPlaylists',
			// 				'getNewReleases',
			// 				'getLikedTracks',
			// 				'getFollowingArtists',
			// 				'search',
			// 				'recentlyPlayed',
			// 			],
			// 		},
			// 	},
			// 	description: 'Whether to return all results or only up to a given limit',
			// },
			// {
			// 	displayName: 'Limit',
			// 	name: 'limit',
			// 	type: 'number',
			// 	default: 50,
			// 	required: true,
			// 	displayOptions: {
			// 		show: {
			// 			resource: ['album', 'artist', 'library', 'playlist', 'track'],
			// 			operation: [
			// 				'getTracks',
			// 				'getAlbums',
			// 				'getUserPlaylists',
			// 				'getNewReleases',
			// 				'getLikedTracks',
			// 				'search',
			// 			],
			// 			returnAll: [false],
			// 		},
			// 	},
			// 	typeOptions: {
			// 		minValue: 1,
			// 		maxValue: 100,
			// 	},
			// 	description: 'Max number of results to return',
			// },
			// {
			// 	displayName: 'Limit',
			// 	name: 'limit',
			// 	type: 'number',
			// 	default: 50,
			// 	required: true,
			// 	displayOptions: {
			// 		show: {
			// 			resource: ['myData', 'player'],
			// 			operation: ['getFollowingArtists', 'recentlyPlayed'],
			// 			returnAll: [false],
			// 		},
			// 	},
			// 	typeOptions: {
			// 		minValue: 1,
			// 		maxValue: 50,
			// 	},
			// 	description: 'Max number of results to return',
			// },
			// {
			// 	displayName: 'Volume',
			// 	name: 'volumePercent',
			// 	type: 'number',
			// 	default: 50,
			// 	required: true,
			// 	displayOptions: {
			// 		show: {
			// 			resource: ['player'],
			// 			operation: ['volume'],
			// 		},
			// 	},
			// 	typeOptions: {
			// 		minValue: 0,
			// 		maxValue: 100,
			// 	},
			// 	description: 'The volume percentage to set',
			// },
			// {
			// 	displayName: 'Filters',
			// 	name: 'filters',
			// 	type: 'collection',
			// 	placeholder: 'Add Filter',
			// 	default: {},
			// 	displayOptions: {
			// 		show: {
			// 			resource: ['album'],
			// 			operation: ['getNewReleases'],
			// 		},
			// 	},
			// 	options: [
			// 		{
			// 			displayName: 'Country',
			// 			name: 'country',
			// 			type: 'options',
			// 			default: 'US',
			// 			options: [], //isoCountryCodes.map(({ name, alpha2 }) => ({ name, value: alpha2 })),
			// 			description: 'Country to filter new releases by',
			// 		},
			// 	],
			// },
			// {
			// 	displayName: 'Filters',
			// 	name: 'filters',
			// 	type: 'collection',
			// 	placeholder: 'Add Filter',
			// 	default: {},
			// 	displayOptions: {
			// 		show: {
			// 			resource: ['playlist', 'artist', 'track', 'album'],
			// 			operation: ['search'],
			// 		},
			// 	},
			// 	options: [
			// 		{
			// 			displayName: 'Country',
			// 			name: 'market',
			// 			type: 'options',
			// 			options: [], //isoCountryCodes.map(({ name, alpha2 }) => ({ name, value: alpha2 })),
			// 			default: '',
			// 			description:
			// 				'If a country code is specified, only content that is playable in that market is returned',
			// 		},
			// 	],
			// },
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
