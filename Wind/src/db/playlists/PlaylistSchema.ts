import { Document, Schema, model } from 'mongoose'

export interface PlaylistTrack {
    addTimestamp: number,
    encoded: string,
    identifier: string,
    isSeekable: boolean,
    author: string,
    length: number,
    isStream: boolean,
    position: number,
    title: string,
    uri: string,
    thumbnail: string | null
}

export interface IPlaylist {
    userId: string,
    code: string,
    image: string,
    name: string,
    isLove: boolean,
    likes: string[],
    tracks: PlaylistTrack[],
    type: 'Private' | 'Public'
}

export type TPlaylist = Document & IPlaylist

const schema = new Schema(
    {
        userId: { type: String, required: true },
        code: { type: String, default: 'code' },
        image: { type: String, default: '' },
        name: { type: String, default: 'Любимые треки' },
        isLove: { type: Boolean, default: true },
        likes: { type: Array, default: [] },
        tracks: { type: Array, default: [] },
        type: { type: String, default: 'Private' }
    }
)

export default model<IPlaylist>('Playlist', schema, 'playlist')