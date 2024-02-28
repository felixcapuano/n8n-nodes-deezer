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
			const order = excf.getNodeParameter('order', index) as string;

			return { method: 'GET', url: `/search?q=album:"${query}"`, qs: { order } };
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
			const order = excf.getNodeParameter('order', index) as string;

			return { method: 'GET', url: `/search?q=artist:"${query}"`, qs: { order } };
		},
	},
	playlist: {
		get: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/playlist/${id}` };
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
			const order = excf.getNodeParameter('order', index) as string;

			return { method: 'GET', url: `/search?q=playlist:"${query}"`, qs: { order } };
		},
	},
	track: {
		get: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/track/${id}` };
		},
		search: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const query = excf.getNodeParameter('query', index) as string;
			const order = excf.getNodeParameter('order', index) as string;

			return { method: 'GET', url: `/search?q=track:"${query}"`, qs: { order } };
		},
	},
	chart: {
		get: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			return { method: 'GET', url: '/chart' };
		},
		getArtists: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			return { method: 'GET', url: '/chart/artists' };
		},
		getAlbums: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			return { method: 'GET', url: '/chart/albums' };
		},
		getTracks: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			return { method: 'GET', url: '/chart/tracks' };
		},
		getPlaylists: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			return { method: 'GET', url: '/chart/playlists' };
		},
		getPodcasts: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			return { method: 'GET', url: '/chart/podcasts' };
		},
	},
	user: {
		get: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			return { method: 'GET', url: `/user/me` };
		},
		getPlaylists: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			return { method: 'GET', url: `/user/me/playlists` };
		},
		getFavoriteTracks: async (
			excf: IExecuteFunctions,
			index: number,
		): Promise<IHttpRequestOptions> => {
			return { method: 'GET', url: `/user/me/tracks` };
		},
		getFavoriteAlbums: async (
			excf: IExecuteFunctions,
			index: number,
		): Promise<IHttpRequestOptions> => {
			return { method: 'GET', url: `/user/me/albums` };
		},
		getFavoriteArtists: async (
			excf: IExecuteFunctions,
			index: number,
		): Promise<IHttpRequestOptions> => {
			return { method: 'GET', url: `/user/me/artists` };
		},
		getFavoritePodcasts: async (
			excf: IExecuteFunctions,
			index: number,
		): Promise<IHttpRequestOptions> => {
			return { method: 'GET', url: `/user/me/podcasts` };
		},
		getFavoriteRadios: async (
			excf: IExecuteFunctions,
			index: number,
		): Promise<IHttpRequestOptions> => {
			return { method: 'GET', url: `/user/me/radios` };
		},
		getFlow: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			return { method: 'GET', url: `/user/me/flow` };
		},
		getFollowings: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			return { method: 'GET', url: `/user/me/followings` };
		},
		getFollowers: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			return { method: 'GET', url: `/user/me/followers` };
		},
		getRecentTracks: async (
			excf: IExecuteFunctions,
			index: number,
		): Promise<IHttpRequestOptions> => {
			return { method: 'GET', url: `/user/me/history` };
		},
	},
	podcast: {
		get: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/podcast/${id}` };
		},
		getEpisodes: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/podcast/${id}/episodes` };
		},
		search: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const query = excf.getNodeParameter('query', index) as string;
			const order = excf.getNodeParameter('order', index) as string;

			return { method: 'GET', url: `/search?q=podcast:"${query}"`, qs: { order } };
		},
	},
} as any;
