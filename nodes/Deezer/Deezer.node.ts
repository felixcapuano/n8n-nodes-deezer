import type {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestMethods,
} from 'n8n-workflow';

import { deezerApiRequest, deezerApiRequestAllItems } from './GenericFunctions';

// import { isoCountryCodes } from './IsoCountryCodes';

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
					{
						name: 'Album',
						value: 'album',
					},
					{
						name: 'Artist',
						value: 'artist',
					},
					{
						name: 'Library',
						value: 'library',
					},
					{
						name: 'My Data',
						value: 'myData',
					},
					{
						name: 'Player',
						value: 'player',
					},
					{
						name: 'Playlist',
						value: 'playlist',
					},
					{
						name: 'Track',
						value: 'track',
					},
				],
				default: 'player',
			},

			// --------------------------------------------------------------------------------------------------------
			//         Player Operations
			//         Pause, Play, Resume, Get Recently Played, Get Currently Playing, Next Song, Previous Song,
			//         Add to Queue, Set Volume
			// --------------------------------------------------------------------------------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['player'],
					},
				},
				options: [
					{
						name: 'Add Song to Queue TODO',
						value: 'addSongToQueue',
						description: 'Add a song to your queue',
						action: 'Add a song to a queue',
					},
					{
						name: 'Currently Playing TODO',
						value: 'currentlyPlaying',
						description: 'Get your currently playing track',
						action: 'Get the currently playing track',
					},
					{
						name: 'Next Song TODO',
						value: 'nextSong',
						description: 'Skip to your next track',
						action: 'Skip to the next track',
					},
					{
						name: 'Pause TODO',
						value: 'pause',
						description: 'Pause your music',
						action: 'Pause the player',
					},
					{
						name: 'Previous Song TODO',
						value: 'previousSong',
						description: 'Skip to your previous song',
						action: 'Skip to the previous song',
					},
					{
						name: 'Recently Played TODO',
						value: 'recentlyPlayed',
						description: 'Get your recently played tracks',
						action: 'Get the recently played tracks',
					},
					{
						name: 'Resume TODO',
						value: 'resume',
						description: 'Resume playback on the current active device',
						action: 'Resume the player',
					},
					{
						name: 'Set Volume TODO',
						value: 'volume',
						description: 'Set volume on the current active device',
						action: 'Set volume on the player',
					},
					{
						name: 'Start Music TODO',
						value: 'startMusic',
						description: 'Start playing a playlist, artist, or album',
						action: 'Start music on the player',
					},
				],
				default: 'addSongToQueue',
			},
			{
				displayName: 'Resource ID',
				name: 'id',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['player'],
						operation: ['startMusic'],
					},
				},
				placeholder: '1234567',
				description: 'Enter a playlist, artist, or album ID',
			},
			{
				displayName: 'Track ID',
				name: 'id',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['player'],
						operation: ['addSongToQueue'],
					},
				},
				placeholder: '1234567',
				description: 'Enter a track ID',
			},

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
						name: 'Get Fans TODO',
						value: 'getFans',
						description: "Get a list of album's fans. Represented by an array of User objects",
						action: "Get a list of album's fans",
					},
					{
						name: 'Search TODO',
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
						name: 'Get Radios TODO',
						value: 'getRadios',
						description: 'Get artist radios by ID',
						action: 'Get artist radios by ID',
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
						name: 'Add an Item TODO',
						value: 'add',
						description: 'Add tracks to a playlist by track and playlist ID',
						action: 'Add an Item to a playlist',
					},
					{
						name: 'Create a Playlist TODO',
						value: 'create',
						description: 'Create a new playlist',
						action: 'Create a playlist',
					},
					{
						name: 'Get TODO',
						value: 'get',
						description: 'Get a playlist by ID',
						action: 'Get a playlist',
					},
					{
						name: "Get the User's Playlists TODO",
						value: 'getUserPlaylists',
						description: "Get a user's playlists",
						action: "Get a user's playlists",
					},
					{
						name: 'Get Tracks TODO',
						value: 'getTracks',
						description: "Get a playlist's tracks by ID",
						action: "Get a playlist's tracks by ID",
					},
					{
						name: 'Remove an Item TODO',
						value: 'delete',
						description: 'Remove tracks from a playlist by track and playlist ID',
						action: 'Remove an item from a playlist',
					},
					{
						name: 'Search TODO',
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
						operation: ['add', 'delete', 'get', 'getTracks'],
					},
				},
				placeholder: 'deezer:playlist:37i9dQZF1DWUhI3iC1khPH',
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
						operation: ['add', 'delete'],
					},
				},
				placeholder: '1234567',
				description: "The track's Deezer ID. The track to add/delete from the playlist.",
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
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['library'],
					},
				},
				options: [
					{
						name: 'Get Liked Tracks TODO',
						value: 'getLikedTracks',
						description: "Get the user's liked tracks",
						action: 'Get liked tracks',
					},
				],
				default: 'getLikedTracks',
			},

			// ---------------------------------------
			//         My Data Operations
			//         Get Followed Artists
			// ---------------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['myData'],
					},
				},
				options: [
					{
						name: 'Get Following Artists TODO',
						value: 'getFollowingArtists',
						description: 'Get your followed artists',
						action: 'Get your followed artists',
					},
				],
				default: 'getFollowingArtists',
			},
			{
				displayName: 'Return All',
				name: 'returnAll',
				type: 'boolean',
				default: false,
				required: true,
				displayOptions: {
					show: {
						resource: ['album', 'artist', 'library', 'myData', 'playlist', 'track', 'player'],
						operation: [
							'getTracks',
							'getAlbums',
							'getUserPlaylists',
							'getNewReleases',
							'getLikedTracks',
							'getFollowingArtists',
							'search',
							'recentlyPlayed',
						],
					},
				},
				description: 'Whether to return all results or only up to a given limit',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				required: true,
				displayOptions: {
					show: {
						resource: ['album', 'artist', 'library', 'playlist', 'track'],
						operation: [
							'getTracks',
							'getAlbums',
							'getUserPlaylists',
							'getNewReleases',
							'getLikedTracks',
							'search',
						],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
				description: 'Max number of results to return',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				required: true,
				displayOptions: {
					show: {
						resource: ['myData', 'player'],
						operation: ['getFollowingArtists', 'recentlyPlayed'],
						returnAll: [false],
					},
				},
				typeOptions: {
					minValue: 1,
					maxValue: 50,
				},
				description: 'Max number of results to return',
			},
			{
				displayName: 'Volume',
				name: 'volumePercent',
				type: 'number',
				default: 50,
				required: true,
				displayOptions: {
					show: {
						resource: ['player'],
						operation: ['volume'],
					},
				},
				typeOptions: {
					minValue: 0,
					maxValue: 100,
				},
				description: 'The volume percentage to set',
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['album'],
						operation: ['getNewReleases'],
					},
				},
				options: [
					{
						displayName: 'Country',
						name: 'country',
						type: 'options',
						default: 'US',
						options: [], //isoCountryCodes.map(({ name, alpha2 }) => ({ name, value: alpha2 })),
						description: 'Country to filter new releases by',
					},
				],
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: {
					show: {
						resource: ['playlist', 'artist', 'track', 'album'],
						operation: ['search'],
					},
				},
				options: [
					{
						displayName: 'Country',
						name: 'market',
						type: 'options',
						options: [], //isoCountryCodes.map(({ name, alpha2 }) => ({ name, value: alpha2 })),
						default: '',
						description:
							'If a country code is specified, only content that is playable in that market is returned',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Get all of the incoming input data to loop through
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// For Post
		const body: IDataObject = {};
		// For Query string
		let qs: IDataObject;

		let requestMethod: IHttpRequestMethods;
		let endpoint: string;
		let returnAll: boolean;
		let propertyName = '';
		let responseData;

		const operation = this.getNodeParameter('operation', 0);
		const resource = this.getNodeParameter('resource', 0);

		// Set initial values
		requestMethod = 'GET';
		endpoint = '';
		qs = {};
		returnAll = false;

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'player') {
					// -----------------------------
					//      Player Operations
					// -----------------------------

					if (operation === 'pause') {
						requestMethod = 'PUT';

						endpoint = '/me/player/pause';

						responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

						responseData = { success: true };
					} else if (operation === 'recentlyPlayed') {
						requestMethod = 'GET';

						endpoint = '/me/player/recently-played';

						returnAll = this.getNodeParameter('returnAll', i);

						propertyName = 'items';

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i);

							qs = {
								limit,
							};

							responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

							responseData = responseData.items;
						}
					} else if (operation === 'currentlyPlaying') {
						requestMethod = 'GET';

						endpoint = '/me/player/currently-playing';

						responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);
					} else if (operation === 'nextSong') {
						requestMethod = 'POST';

						endpoint = '/me/player/next';

						responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

						responseData = { success: true };
					} else if (operation === 'previousSong') {
						requestMethod = 'POST';

						endpoint = '/me/player/previous';

						responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

						responseData = { success: true };
					} else if (operation === 'startMusic') {
						requestMethod = 'PUT';

						endpoint = '/me/player/play';

						const id = this.getNodeParameter('id', i) as string;

						body.context_uri = id;

						responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

						responseData = { success: true };
					} else if (operation === 'addSongToQueue') {
						requestMethod = 'POST';

						endpoint = '/me/player/queue';

						const id = this.getNodeParameter('id', i) as string;

						qs = {
							uri: id,
						};

						responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

						responseData = { success: true };
					} else if (operation === 'resume') {
						requestMethod = 'PUT';

						endpoint = '/me/player/play';

						responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

						responseData = { success: true };
					} else if (operation === 'volume') {
						requestMethod = 'PUT';

						endpoint = '/me/player/volume';

						const volumePercent = this.getNodeParameter('volumePercent', i) as number;

						qs = {
							volume_percent: volumePercent,
						};

						responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

						responseData = { success: true };
					}
				} else if (resource === 'album') {
					// -----------------------------
					//      Album Operations
					// -----------------------------

					if (operation === 'get') {
						const id = this.getNodeParameter('id', i) as string;

						requestMethod = 'GET';

						endpoint = `/album/${id}`;

						responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);
					} else if (operation === 'getNewReleases') {
						endpoint = '/browse/new-releases';
						requestMethod = 'GET';
						propertyName = 'albums.items';

						const filters = this.getNodeParameter('filters', i);

						if (Object.keys(filters).length) {
							Object.assign(qs, filters);
						}

						returnAll = this.getNodeParameter('returnAll', i);

						if (!returnAll) {
							qs.limit = this.getNodeParameter('limit', i);
							responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);
							responseData = responseData.albums.items;
						}
					} else if (operation === 'getTracks') {
						const id = this.getNodeParameter('id', i) as string;

						requestMethod = 'GET';

						endpoint = `/album/${id}/tracks`;

						propertyName = 'tracks';

						returnAll = this.getNodeParameter('returnAll', i);

						propertyName = 'items';

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i);

							qs = {
								limit,
							};

							responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

							responseData = responseData.data;
						}
					} else if (operation === 'search') {
						requestMethod = 'GET';

						endpoint = '/search';

						propertyName = 'albums.items';

						returnAll = this.getNodeParameter('returnAll', i);
						const q = this.getNodeParameter('query', i) as string;
						const filters = this.getNodeParameter('filters', i);

						qs = {
							q,
							type: 'album',
							...filters,
						};

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i);
							qs.limit = limit;
							responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);
							responseData = responseData.albums.items;
						}
					}
				} else if (resource === 'artist') {
					// -----------------------------
					//      Artist Operations
					// -----------------------------

					const id = this.getNodeParameter('id', i, '') as string;

					if (operation === 'getAlbums') {
						endpoint = `/artists/${id}/albums`;

						returnAll = this.getNodeParameter('returnAll', i);

						propertyName = 'items';

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i);

							qs = {
								limit,
							};

							responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

							responseData = responseData.items;
						}
					} else if (operation === 'getRelatedArtists') {
						endpoint = `/artists/${id}/related-artists`;

						responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

						responseData = responseData.artists;
					} else if (operation === 'getTopTracks') {
						const country = this.getNodeParameter('country', i) as string;

						qs = {
							country,
						};
						endpoint = `/artist/${id}/top`;

						responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

						responseData = responseData.tracks;
					} else if (operation === 'get') {
						requestMethod = 'GET';

						endpoint = `/artist/${id}`;

						responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);
					} else if (operation === 'search') {
						requestMethod = 'GET';

						endpoint = '/search';

						propertyName = 'artists.items';

						returnAll = this.getNodeParameter('returnAll', i);
						const q = this.getNodeParameter('query', i) as string;
						const filters = this.getNodeParameter('filters', i);

						qs = {
							q,
							limit: 50,
							type: 'artist',
							...filters,
						};

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i);
							qs.limit = limit;
							responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);
							responseData = responseData.artists.items;
						}
					}
				} else if (resource === 'playlist') {
					// -----------------------------
					//      Playlist Operations
					// -----------------------------

					if (['delete', 'get', 'getTracks', 'add'].includes(operation)) {
						const id = this.getNodeParameter('id', i) as string;

						if (operation === 'delete') {
							requestMethod = 'DELETE';
							const trackId = this.getNodeParameter('trackID', i) as string;

							body.tracks = [
								{
									uri: trackId,
								},
							];

							endpoint = `/playlists/${id}/tracks`;

							responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

							responseData = { success: true };
						} else if (operation === 'get') {
							requestMethod = 'GET';

							endpoint = `/playlist/${id}`;

							responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);
						} else if (operation === 'getTracks') {
							requestMethod = 'GET';

							endpoint = `/playlist/${id}/tracks`;

							returnAll = this.getNodeParameter('returnAll', i);

							propertyName = 'items';

							if (!returnAll) {
								const limit = this.getNodeParameter('limit', i);

								qs = {
									limit,
								};

								responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

								responseData = responseData.data;
							}
						} else if (operation === 'add') {
							requestMethod = 'POST';

							const trackId = this.getNodeParameter('trackID', i) as string;
							const additionalFields = this.getNodeParameter('additionalFields', i);

							qs = {
								uris: trackId,
							};

							if (additionalFields.position !== undefined) {
								qs.position = additionalFields.position;
							}

							endpoint = `/playlists/${id}/tracks`;

							responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);
						}
					} else if (operation === 'getUserPlaylists') {
						requestMethod = 'GET';

						endpoint = '/me/playlists';

						returnAll = this.getNodeParameter('returnAll', i);

						propertyName = 'items';

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i);

							qs = {
								limit,
							};

							responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

							responseData = responseData.items;
						}
					} else if (operation === 'create') {
						// https://developer.deezer.com/console/post-playlists/

						body.name = this.getNodeParameter('name', i) as string;

						const additionalFields = this.getNodeParameter('additionalFields', i);

						if (Object.keys(additionalFields).length) {
							Object.assign(body, additionalFields);
						}

						responseData = await deezerApiRequest.call(this, 'POST', '/me/playlists', body, qs);
					} else if (operation === 'search') {
						requestMethod = 'GET';

						endpoint = '/search';

						propertyName = 'playlists.items';

						returnAll = this.getNodeParameter('returnAll', i);
						const q = this.getNodeParameter('query', i) as string;
						const filters = this.getNodeParameter('filters', i);

						qs = {
							q,
							type: 'playlist',
							limit: 50,
							...filters,
						};

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i);
							qs.limit = limit;
							responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);
							responseData = responseData.playlists.items;
						}
					}
				} else if (resource === 'track') {
					// -----------------------------
					//      Track Operations
					// -----------------------------

					const id = this.getNodeParameter('id', i, '') as string;

					requestMethod = 'GET';

					if (operation === 'getAudioFeatures') {
						endpoint = `/audio-features/${id}`;
						responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);
					} else if (operation === 'get') {
						endpoint = `/tracks/${id}`;
						responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);
					} else if (operation === 'search') {
						requestMethod = 'GET';

						endpoint = '/search';

						propertyName = 'tracks.items';

						returnAll = this.getNodeParameter('returnAll', i);
						const q = this.getNodeParameter('query', i) as string;
						const filters = this.getNodeParameter('filters', i);

						qs = {
							q,
							type: 'track',
							limit: 50,
							...filters,
						};

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i);
							qs.limit = limit;
							responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);
							responseData = responseData.tracks.items;
						}
					}
				} else if (resource === 'library') {
					// -----------------------------
					//      Library Operations
					// -----------------------------

					if (operation === 'getLikedTracks') {
						requestMethod = 'GET';

						endpoint = '/me/tracks';

						returnAll = this.getNodeParameter('returnAll', i);

						propertyName = 'items';

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i);

							qs = {
								limit,
							};

							responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

							responseData = responseData.items;
						}
					}
				} else if (resource === 'myData') {
					if (operation === 'getFollowingArtists') {
						requestMethod = 'GET';

						endpoint = '/me/following';

						returnAll = this.getNodeParameter('returnAll', i);

						propertyName = 'artists.items';

						qs = {
							type: 'artist',
						};

						if (!returnAll) {
							const limit = this.getNodeParameter('limit', i);
							qs = {
								type: 'artist',
								limit,
							};
							responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);
							responseData = responseData.artists.items;
						}
					}
				}

				if (returnAll) {
					responseData = await deezerApiRequestAllItems.call(
						this,
						propertyName,
						requestMethod,
						endpoint,
						body,
						qs,
					);
				}

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
