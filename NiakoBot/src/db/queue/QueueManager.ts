import { ChannelType, Collection, Guild, VoiceChannel } from "discord.js";
import { QueueSchema, TQueue } from "./QueueSchema";
import Mongoose from "../Mongoose";

export default class QueueManager {
    private readonly cache: Collection<string, TQueue> = new Collection()
    
    constructor(
        private db: Mongoose
    ) {}

    async init() {
        const array = await this.array()

        for ( let i = 0; array.length > i; i++ ) {
            const doc = array[i]
            const guild = this.db.client.guilds.cache.get(doc.guildId)
            if(guild) {
                let cache = true
                if(doc.played) {
                    if(doc.voiceId === '0' || doc.textId === '0' || doc.tracks.length === 0) {
                        this.destroy(doc, guild, 'В голосвом канале не осталось учатсников, я вышла...')
                        cache = false
                    } else {
                        const voice = guild.channels.cache.get(doc.voiceId)
                        if(!voice || ![ChannelType.GuildStageVoice, ChannelType.GuildVoice].includes(voice.type) || (voice as VoiceChannel).members.size === 0) {
                            this.destroy(doc, guild, 'В голосвом канале не осталось учатсников, я вышла...')
                            cache = false
                        }

                        const node = this.db.client.player.getNode()!
                        
                        const player = await node.joinChannel({
                            guildId: doc.guildId,
                            channelId: doc.voiceId,
                            shardId: 0
                        }).catch(() => {})
            
                        if(player) {
                            player.on('start', async (data) => {
                                return (await import('../../app/Player Events/TrackStart')).default(this.db.client, data)
                            })

                            player.on('end', async (data) => {
                                return (await import('../../app/Player Events/TrackEnd')).default(this.db.client, data)
                            })

                            player.playTrack(
                                { track: doc.tracks[0].track, options: { pause: doc.paused } }
                            ).setVolume(doc.volume)
                        }
                    }
                }

                if(cache) this.cache.set(doc.guildId, doc)
            } else if(doc.played) {
                await this.destroy(doc)
            }
        }
    }

    async array(cache: boolean = false) {
        return cache ? this.cache.map((q) => q) : await QueueSchema.find()
    }

    getTrack(queue: TQueue, trackId: string) {
        return queue.tracks.find((t) => t.track === trackId)
    }

    async get(guildId: string) {
        const get = this.cache.get(guildId)
        if(get) return get
        else {
            return (await QueueSchema.findOne({ guildId }) ?? await this.create(guildId))
        }
    }

    async create(guildId: string) {
        const doc = await QueueSchema.create({ guildId })
        return (await this.save(doc))
    }

    async save(doc: TQueue) {
        doc.markModified('lasts')
        doc.markModified('tracks')
        
        const saved = await doc.save()
        this.cache.set(saved.guildId, saved)
        return saved
    }

    async destroy(doc: TQueue, guild?: Guild, reason?: string) {
        const node = this.db.client.player.getNode()!

        reason = reason ? reason : `В очереди ${this.db.client.user.username} больше не осталось треков...`

        if(guild) {
            const text = guild.channels.cache.get(doc.textId)
            if(text && text.type === ChannelType.GuildText) {
                await text.send({
                    embeds: [ this.db.client.storage.embeds.music(reason) ]
                }).catch(() => {})
            }
        }

        doc.tracks = []
        doc.lasts = {}
        doc.played = false
        doc.paused = false
        doc.pausedTimestamp = 0
        doc.filter = ''
        doc.volume = 0.5
        doc.voiceId = '0'
        doc.textId = '0'
        doc.repeat = 'None'
        doc.messageId = '0'

        await this.save(doc)

        node.leaveChannel(doc.guildId)
        node.players.delete(doc.guildId)
    }
}