import { IDataObject, IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import { buildDeezerSearchQuery } from './GenericFunctions';

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
			const order = excf.getNodeParameter('order', index) as string;
			const keyword = excf.getNodeParameter('keyword', index) as string;
			const filters = excf.getNodeParameter('filters', index) as IDataObject;

			const query = buildDeezerSearchQuery(keyword, filters);

			return { method: 'GET', url: `/search/album`, qs: { order, q: query } };
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
			const order = excf.getNodeParameter('order', index) as string;
			const keyword = excf.getNodeParameter('keyword', index) as string;
			const filters = excf.getNodeParameter('filters', index) as IDataObject;

			const query = buildDeezerSearchQuery(keyword, filters);

			return { method: 'GET', url: `/search/artist`, qs: { order, q: query } };
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
			const order = excf.getNodeParameter('order', index) as string;
			const keyword = excf.getNodeParameter('keyword', index) as string;
			const filters = excf.getNodeParameter('filters', index) as IDataObject;

			const query = buildDeezerSearchQuery(keyword, filters);

			return { method: 'GET', url: `/search/playlist`, qs: { order, q: query } };
		},
	},
	track: {
		get: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const id = excf.getNodeParameter('id', index) as string;

			return { method: 'GET', url: `/track/${id}` };
		},
		search: async (excf: IExecuteFunctions, index: number): Promise<IHttpRequestOptions> => {
			const order = excf.getNodeParameter('order', index) as string;
			const keyword = excf.getNodeParameter('keyword', index) as string;
			const filters = excf.getNodeParameter('filters', index) as IDataObject;

			const query = buildDeezerSearchQuery(keyword, filters);

			return { method: 'GET', url: `/search/track`, qs: { order, q: query } };
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
			const order = excf.getNodeParameter('order', index) as string;
			const keyword = excf.getNodeParameter('keyword', index) as string;
			const filters = excf.getNodeParameter('filters', index) as IDataObject;

			const query = buildDeezerSearchQuery(keyword, filters);

			return { method: 'GET', url: `/search/podcast`, qs: { order, q: query } };
		},
	},
} as any;
