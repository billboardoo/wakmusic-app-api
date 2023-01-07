import { resolve } from 'path';

export const rootPath = resolve(__dirname, '../../../');
export const lyricsPath = resolve(rootPath, 'static/lyrics');

export const staticPath = resolve(rootPath, 'static');
export const staticNewsPath = resolve(rootPath, 'static/images/news');
export const staticArtistPath = resolve(rootPath, 'static/images/artist');
export const staticProfilePath = resolve(rootPath, 'static/images/profile');
export const staticPlaylistPath = resolve(rootPath, 'static/images/playlist');

export const baseUrl = 'http://localhost:3000/api';
