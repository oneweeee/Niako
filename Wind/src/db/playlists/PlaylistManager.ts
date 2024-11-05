import PlaylistSchema, { TPlaylist } from './PlaylistSchema'
import { Track } from '../../struct/wind/WindPlayer'
import { Collection } from 'discord.js'
import WindClient from '#client'


export default class PlaylistManager {
    private readonly cache: Collection<string, TPlaylist> = new Collection()

    constructor(
        private client: WindClient
    ) {}

    async array() {
        return PlaylistSchema.find({})
    }

    async get(userId: string) {
        const cl = this.cache.filter(p => p.userId === userId || (p.likes.includes(userId) && p.type !== 'Private'))
        if(cl.size > 0) {
            return cl.map(p => p)
        } else {
            return (await this.getMongo(userId) ?? await this.create(userId))
        }
    }

    async getOnlyUser(userId: string): Promise<TPlaylist[]> {
        const cl = this.cache.filter(p => p.userId === userId)
        if(cl.size > 0) {
            return cl.map(p => p)
        } else {
            return (await this.getOnlyUserMongo(userId) ?? await this.create(userId))
        }
    }

    async getOnlyUserMongo(userId: string) {
        return (await PlaylistSchema.find()).filter(p => p.userId === userId)
    }

    async getMongo(userId: string) {
        return (await PlaylistSchema.find()).filter(p => p.userId === userId || p.likes.includes(userId))
    }

    async checkLoveTracks(userId: string) {
        const cache = this.cache.find(p => p.userId === userId && p.isLove)
        if(cache) {
            return cache
        } else {
            return (await PlaylistSchema.findOne({ userId, name: 'Любимые треки', isLove: true }) ?? await this.create(userId))
        }
    }

    async getByCode(code: string) {
        return (await PlaylistSchema.findOne({ code }))
    }

    async create(userId: string, name?: string) {
        const doc = await PlaylistSchema.create({ userId })
        doc.code = this.createPlaylistCode()

        if(name) {
            doc.name = name
            doc.type = 'Public'
            doc.isLove = false
        }

        return (await this.save(doc))!
    }

    async remove(res: TPlaylist) {
        const obj = res.toObject()
        await res.deleteOne()

        return obj
    }

    async save(doc: TPlaylist) {
        const saved = await doc.save().catch((err) => { this.client.logger.error(err); return null })
        return saved
    }

    pushTrack(doc: TPlaylist, track: Track) {
        doc.tracks.push(
            {
                addTimestamp: Date.now(),
                encoded: track.encoded,
                identifier: track.info.identifier,
                isSeekable: track.info.isSeekable,
                author: track.info.author,
                length: track.info.length,
                isStream: track.info.isStream,
                position: track.info.position,
                title: track.info.title,
                uri: track.info.uri!,
                thumbnail: track.thumbnail
            }
        )
        
        return doc
    }

    createPlaylistCode() {
        const one = `${Math.random().toString(34).slice(5, 10)}`
        const two = `${Math.random().toString(34).slice(5, 10)}`
        const three = `${Math.random().toString(34).slice(5, 10)}`
        const four = `${Math.random().toString(34).slice(5, 10)}`
        return `${one}-${two}-${three}-${four}`
    }
}