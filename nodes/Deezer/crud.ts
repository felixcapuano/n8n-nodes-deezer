import { IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';

export default {
	album: {
		get: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/album/${id}` };
		},
		getTracks: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/album/${id}/tracks` };
		},
		getFans: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/album/${id}/fans` };
		},
		search: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const query = excf.getNodeParameter('query', index) as string;

			return { method: 'GET', url: `/search?q=album:"${query}"` };
		},
	},
	artist: {
		get: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/artist/${id}` };
		},
		getTopTracks: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/artist/${id}/top` };
		},
		getAlbums: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/artist/${id}/albums` };
		},
		getFans: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/artist/${id}/fans` };
		},
		getRelatedArtists: async (
			excf: IExecuteFunctions,
			index: number,
		): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/artist/${id}/related` };
		},
		getRadio: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/artist/${id}/radio` };
		},
		getPlaylists: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/artist/${id}/playlists` };
		},
		search: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const query = excf.getNodeParameter('query', index) as string;

			return { method: 'GET', url: `/search?q=artist:"${query}"` };
		},
	},
	playlist: {
		get: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/playlist/${id}` };
		},
		getUserPlaylists: async (
			excf: IExecuteFunctions,
			index: number,
		): Promise<IHttpRequestOptions> => {
			return { method: 'GET', url: `/user/me/playlists` };
		},
		create: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;
			const name = excf.getNodeParameter('name', index) as string;

			return { method: 'POST', url: `user/me/playlists/${id}`, qs: { title: name } };
		},
		delete: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'DELETE', url: `/playlist/${id}` };
		},
		getFans: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/playlist/${id}/fans` };
		},
		getTracks: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/playlist/${id}/tracks` };
		},
		add: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;
			const trackId = excf.getNodeParameter('trackID', index) as string;

			return { method: 'POST', url: `/playlist/${id}/tracks`, qs: { songs: trackId } };
		},
		remove: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;
			const trackId = excf.getNodeParameter('trackID', index) as string;

			return { method: 'DELETE', url: `/playlist/${id}/tracks`, qs: { songs: trackId } };
		},
		getRadio: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/playlist/${id}/radio` };
		},
		search: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const query = excf.getNodeParameter('query', index) as string;

			return { method: 'GET', url: `/search?q=playlist:"${query}"` };
		},
	},
} as any;

// if (resource === 'player') {
// 	// -----------------------------
// 	//      Player Operations
// 	// -----------------------------

// 	if (operation === 'pause') {
// 		requestMethod = 'PUT';

// 		endpoint = '/me/player/pause';

// 		responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

// 		responseData = { success: true };
// 	} else if (operation === 'recentlyPlayed') {
// 		requestMethod = 'GET';

// 		endpoint = '/me/player/recently-played';

// 		returnAll = this.getNodeParameter('returnAll', i);

// 		propertyName = 'items';

// 		if (!returnAll) {
// 			const limit = this.getNodeParameter('limit', i);

// 			qs = {
// 				limit,
// 			};

// 			responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

// 			responseData = responseData.items;
// 		}
// 	} else if (operation === 'currentlyPlaying') {
// 		requestMethod = 'GET';

// 		endpoint = '/me/player/currently-playing';

// 		responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);
// 	} else if (operation === 'nextSong') {
// 		requestMethod = 'POST';

// 		endpoint = '/me/player/next';

// 		responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

// 		responseData = { success: true };
// 	} else if (operation === 'previousSong') {
// 		requestMethod = 'POST';

// 		endpoint = '/me/player/previous';

// 		responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

// 		responseData = { success: true };
// 	} else if (operation === 'startMusic') {
// 		requestMethod = 'PUT';

// 		endpoint = '/me/player/play';

// 		const id = this.getNodeParameter('id', i) as string;

// 		body.context_uri = id;

// 		responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

// 		responseData = { success: true };
// 	} else if (operation === 'addSongToQueue') {
// 		requestMethod = 'POST';

// 		endpoint = '/me/player/queue';

// 		const id = this.getNodeParameter('id', i) as string;

// 		qs = {
// 			uri: id,
// 		};

// 		responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

// 		responseData = { success: true };
// 	} else if (operation === 'resume') {
// 		requestMethod = 'PUT';

// 		endpoint = '/me/player/play';

// 		responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

// 		responseData = { success: true };
// 	} else if (operation === 'volume') {
// 		requestMethod = 'PUT';

// 		endpoint = '/me/player/volume';

// 		const volumePercent = this.getNodeParameter('volumePercent', i) as number;

// 		qs = {
// 			volume_percent: volumePercent,
// 		};

// 		responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

// 		responseData = { success: true };
// 	}
// } else if (resource === 'album') {
// 	// -----------------------------
// 	//      Album Operations
// 	// -----------------------------

// 	if (operation === 'get') {
// 		const id = this.getNodeParameter('id', i) as string;

// 		requestMethod = 'GET';

// 		endpoint = `/album/${id}`;

// 		responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);
// 	} else if (operation === 'getTracks') {
// 		const id = this.getNodeParameter('id', i) as string;

// 		requestMethod = 'GET';

// 		endpoint = `/album/${id}/tracks`;

// 		propertyName = 'tracks';

// 		returnAll = this.getNodeParameter('returnAll', i);

// 		propertyName = 'items';

// 		if (!returnAll) {
// 			const limit = this.getNodeParameter('limit', i);

// 			qs = {
// 				limit,
// 			};

// 			responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

// 			responseData = responseData.data;
// 		}
// 	} else if (operation === 'getFans') {
// 		const id = this.getNodeParameter('id', i) as string;

// 		requestMethod = 'GET';

// 		endpoint = `/album/${id}/fans`;

// 		propertyName = 'tracks';

// 		returnAll = this.getNodeParameter('returnAll', i);

// 		propertyName = 'items';

// 		if (!returnAll) {
// 			const limit = this.getNodeParameter('limit', i);

// 			qs = {
// 				limit,
// 			};

// 			responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

// 			responseData = responseData.data;
// 		}
// 	} else if (operation === 'search') {
// 		requestMethod = 'GET';

// 		endpoint = '/search';

// 		propertyName = 'albums.items';

// 		returnAll = this.getNodeParameter('returnAll', i);
// 		const q = this.getNodeParameter('query', i) as string;
// 		const filters = this.getNodeParameter('filters', i);

// 		qs = {
// 			q,
// 			type: 'album',
// 			...filters,
// 		};

// 		if (!returnAll) {
// 			const limit = this.getNodeParameter('limit', i);
// 			qs.limit = limit;
// 			responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);
// 			responseData = responseData.albums.items;
// 		}
// 	}
// } else if (resource === 'artist') {
// 	// -----------------------------
// 	//      Artist Operations
// 	// -----------------------------

// 	const id = this.getNodeParameter('id', i, '') as string;

// 	if (operation === 'getAlbums') {
// 		endpoint = `/artists/${id}/albums`;

// 		returnAll = this.getNodeParameter('returnAll', i);

// 		propertyName = 'items';

// 		if (!returnAll) {
// 			const limit = this.getNodeParameter('limit', i);

// 			qs = {
// 				limit,
// 			};

// 			responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

// 			responseData = responseData.items;
// 		}
// 	} else if (operation === 'getRelatedArtists') {
// 		endpoint = `/artists/${id}/related-artists`;

// 		responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

// 		responseData = responseData.artists;
// 	} else if (operation === 'getTopTracks') {
// 		const country = this.getNodeParameter('country', i) as string;

// 		qs = {
// 			country,
// 		};
// 		endpoint = `/artist/${id}/top`;

// 		responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

// 		responseData = responseData.tracks;
// 	} else if (operation === 'get') {
// 		requestMethod = 'GET';

// 		endpoint = `/artist/${id}`;

// 		responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);
// 	} else if (operation === 'search') {
// 		requestMethod = 'GET';

// 		endpoint = '/search';

// 		propertyName = 'artists.items';

// 		returnAll = this.getNodeParameter('returnAll', i);
// 		const q = this.getNodeParameter('query', i) as string;
// 		const filters = this.getNodeParameter('filters', i);

// 		qs = {
// 			q,
// 			limit: 50,
// 			type: 'artist',
// 			...filters,
// 		};

// 		if (!returnAll) {
// 			const limit = this.getNodeParameter('limit', i);
// 			qs.limit = limit;
// 			responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);
// 			responseData = responseData.artists.items;
// 		}
// 	}
// } else if (resource === 'playlist') {
// 	// -----------------------------
// 	//      Playlist Operations
// 	// -----------------------------

// 	if (['delete', 'get', 'getTracks', 'add'].includes(operation)) {
// 		const id = this.getNodeParameter('id', i) as string;

// 		if (operation === 'delete') {
// 			requestMethod = 'DELETE';
// 			const trackId = this.getNodeParameter('trackID', i) as string;

// 			body.tracks = [
// 				{
// 					uri: trackId,
// 				},
// 			];

// 			endpoint = `/playlists/${id}/tracks`;

// 			responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

// 			responseData = { success: true };
// 		} else if (operation === 'get') {
// 			requestMethod = 'GET';

// 			endpoint = `/playlist/${id}`;

// 			responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);
// 		} else if (operation === 'getTracks') {
// 			requestMethod = 'GET';

// 			endpoint = `/playlist/${id}/tracks`;

// 			returnAll = this.getNodeParameter('returnAll', i);

// 			propertyName = 'items';

// 			if (!returnAll) {
// 				const limit = this.getNodeParameter('limit', i);

// 				qs = {
// 					limit,
// 				};

// 				responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

// 				responseData = responseData.data;
// 			}
// 		} else if (operation === 'add') {
// 			requestMethod = 'POST';

// 			const trackId = this.getNodeParameter('trackID', i) as string;
// 			const additionalFields = this.getNodeParameter('additionalFields', i);

// 			qs = {
// 				uris: trackId,
// 			};

// 			if (additionalFields.position !== undefined) {
// 				qs.position = additionalFields.position;
// 			}

// 			endpoint = `/playlists/${id}/tracks`;

// 			responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);
// 		}
// 	} else if (operation === 'getUserPlaylists') {
// 		requestMethod = 'GET';

// 		endpoint = '/me/playlists';

// 		returnAll = this.getNodeParameter('returnAll', i);

// 		propertyName = 'items';

// 		if (!returnAll) {
// 			const limit = this.getNodeParameter('limit', i);

// 			qs = {
// 				limit,
// 			};

// 			responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

// 			responseData = responseData.items;
// 		}
// 	} else if (operation === 'create') {
// 		// https://developer.deezer.com/console/post-playlists/

// 		body.name = this.getNodeParameter('name', i) as string;

// 		const additionalFields = this.getNodeParameter('additionalFields', i);

// 		if (Object.keys(additionalFields).length) {
// 			Object.assign(body, additionalFields);
// 		}

// 		responseData = await deezerApiRequest.call(this, 'POST', '/me/playlists', body, qs);
// 	} else if (operation === 'search') {
// 		requestMethod = 'GET';

// 		endpoint = '/search';

// 		propertyName = 'playlists.items';

// 		returnAll = this.getNodeParameter('returnAll', i);
// 		const q = this.getNodeParameter('query', i) as string;
// 		const filters = this.getNodeParameter('filters', i);

// 		qs = {
// 			q,
// 			type: 'playlist',
// 			limit: 50,
// 			...filters,
// 		};

// 		if (!returnAll) {
// 			const limit = this.getNodeParameter('limit', i);
// 			qs.limit = limit;
// 			responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);
// 			responseData = responseData.playlists.items;
// 		}
// 	}
// } else if (resource === 'track') {
// 	// -----------------------------
// 	//      Track Operations
// 	// -----------------------------

// 	const id = this.getNodeParameter('id', i, '') as string;

// 	requestMethod = 'GET';

// 	if (operation === 'getAudioFeatures') {
// 		endpoint = `/audio-features/${id}`;
// 		responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);
// 	} else if (operation === 'get') {
// 		endpoint = `/tracks/${id}`;
// 		responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);
// 	} else if (operation === 'search') {
// 		requestMethod = 'GET';

// 		endpoint = '/search';

// 		propertyName = 'tracks.items';

// 		returnAll = this.getNodeParameter('returnAll', i);
// 		const q = this.getNodeParameter('query', i) as string;
// 		const filters = this.getNodeParameter('filters', i);

// 		qs = {
// 			q,
// 			type: 'track',
// 			limit: 50,
// 			...filters,
// 		};

// 		if (!returnAll) {
// 			const limit = this.getNodeParameter('limit', i);
// 			qs.limit = limit;
// 			responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);
// 			responseData = responseData.tracks.items;
// 		}
// 	}
// } else if (resource === 'library') {
// 	// -----------------------------
// 	//      Library Operations
// 	// -----------------------------

// 	if (operation === 'getLikedTracks') {
// 		requestMethod = 'GET';

// 		endpoint = '/me/tracks';

// 		returnAll = this.getNodeParameter('returnAll', i);

// 		propertyName = 'items';

// 		if (!returnAll) {
// 			const limit = this.getNodeParameter('limit', i);

// 			qs = {
// 				limit,
// 			};

// 			responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);

// 			responseData = responseData.items;
// 		}
// 	}
// } else if (resource === 'myData') {
// 	if (operation === 'getFollowingArtists') {
// 		requestMethod = 'GET';

// 		endpoint = '/me/following';

// 		returnAll = this.getNodeParameter('returnAll', i);

// 		propertyName = 'artists.items';

// 		qs = {
// 			type: 'artist',
// 		};

// 		if (!returnAll) {
// 			const limit = this.getNodeParameter('limit', i);
// 			qs = {
// 				type: 'artist',
// 				limit,
// 			};
// 			responseData = await deezerApiRequest.call(this, requestMethod, endpoint, body, qs);
// 			responseData = responseData.artists.items;
// 		}
// 	}
// }

// if (returnAll) {
// 	responseData = await deezerApiRequestAllItems.call(
// 		this,
// 		propertyName,
// 		requestMethod,
// 		endpoint,
// 		body,
// 		qs,
// 	);
// }
