import WindClient from "../WindClient"
import fetch from 'node-fetch'
import {
    BaseGuildVoiceChannel,
    ChannelType,
    Collection,
    CommandInteraction,
    User
} from "discord.js"
import {
    Shoukaku,
    Connectors,
    Track as TrackShoukaku,
    Player,
    LoadType
} from "shoukaku"

export interface Track extends TrackShoukaku {
    user: User,
    thumbnail: string | null,
    startPlaying: number,
    addTimestamp?: number
}

export interface Queue {
    pausedTimestamp: number, repeat: '' | 'Queue' | 'Track',
    shuffle: boolean,
    isDisconnect: boolean,
    lastTracks: { [key: string]: Track },
    node: string,
    messageId: string,
    channelTextId: string,
    player: Player,
    interval: NodeJS.Timer | null,
    volume: number,
    channelVoiceId: string,
    tracks: Track[]
}


export default class WindPlayer extends Shoukaku {
    public queue: Collection<string, Queue> = new Collection()

    constructor(
        private client: WindClient
    ) {
        super(
            new Connectors.DiscordJS(client),
            client.config.lavalink.enabled ? client.config.lavalink.nodes : [],
            { moveOnDisconnect: true }
        )

        this.handler()
    }

    async getLyrics(artist: string, title: string) {
        const response = await fetch(
            `http://185.63.191.27:5000/?track=${artist} — ${title}`
        ).then(async (res) => await res.json()).catch(() => ({ status: false }))
        if(!response?.status) {
            return null
        }

        return response.message
    }

    getLyricArray(lyric: string) {
        const array = lyric.split('\n\n')
        let newLyrics: string[] = []
        let text = ''

        for ( let i = 0; array.length > i; i++ ) {
            const abzac = (array[i] + '\n\n')
            if(array[i].length + text.length > 1024) {
                newLyrics.push(text)
                text = abzac
            } else {
                text += abzac
                if(i === array.length-1) {
                    newLyrics.push(text)
                }
            }
        }

        return newLyrics
    }

    async getTracks(search: string, type: 'sp' = 'sp', isAutocomplete: boolean = false): Promise<{ loadType: LoadType, playlistInfo: { name: string } | null, data: TrackShoukaku[] } | null> {
        const node = this.getNode()
        if(!node) return null

        const result = await node.rest.resolve(
            search.startsWith('https://') ? search : `${type}search:${search}`
        )

        if(!result || [LoadType.EMPTY, LoadType.ERROR].includes(result?.loadType)) return null

        const tracks = result.loadType === LoadType.TRACK ? [ result.data ] :  result.loadType === LoadType.PLAYLIST ? result.data.tracks : result.data as TrackShoukaku[]
        if(isAutocomplete && tracks.length > 20) {
            tracks.slice(0, 20)
        }

        return { ...result, playlistInfo: (result.loadType === LoadType.PLAYLIST ? result.data.info : null), data: tracks }
    }

    async isTrack(search: string, type: 'sp' = 'sp') {
        const res = await this.getTracks(search, type)
        if(!res) return res

        if([LoadType.PLAYLIST, LoadType.SEARCH, LoadType.TRACK].includes(res.loadType)) {
            return res
        } else {
            return null
        }
    }

    async loadTracks(res: { loadType: LoadType, data: TrackShoukaku[] }, channel: BaseGuildVoiceChannel, textId: string, user: User) {
        const node = this.getNode()
        if(!node) return null

        let player = this.players.get(channel.guildId) as Player
        if(!player) {
            player = await this.joinVoiceChannel(
                {
                    guildId: channel.guildId,
                    channelId: channel.id,
                    shardId: channel.guild.shardId
                }
            )

            this.playerHandler(player)
        }

        const queue = this.getQueue(channel.guildId, { node: node.name, channelTextId: textId, channelVoiceId: channel.id, player })!
        if(res.loadType === LoadType.PLAYLIST) {
            for ( let i = 0; res.data.length > i; i++ ) {
                const track = res.data[i]
                queue.tracks.push({
                    ...track,
                    user: user,
                    startPlaying: 0,
                    thumbnail: null
                })
            }
        } else if(res.data[0]) {
            queue.tracks.push({
                ...res.data[0],
                user: user,
                startPlaying: 0,
                thumbnail: null
            })
        }
    }

    getNode(name?: string) {
        return name ? this.nodes.get(name) : this.options.nodeResolver(this.nodes)
    }

    async playTrack(channel: BaseGuildVoiceChannel, textId: string, now: boolean = false) {
        const node = this.getNode()
        if(!node) return null

        let player = this.players.get(channel.guildId) as Player
        if(!player) {
            player = await this.joinVoiceChannel(
                {
                    guildId: channel.guildId,
                    channelId: channel.id,
                    shardId: channel.guild.shardId,
                }
            )

            this.playerHandler(player)
        }

        const queue = this.getQueue(channel.guildId, { node: node.name, channelTextId: textId, channelVoiceId: channel.id, player })!

        if((!player.paused && !player.track) || (now && queue.tracks[0]?.info)) {
            queue.tracks[0].thumbnail = await this.getThumbnail(queue.tracks[0].info.uri!)
            queue.tracks[0].startPlaying = Date.now()
            player.playTrack({ track: queue.tracks[0].encoded, options: { noReplace: false } })
            player.setGlobalVolume(queue ? queue.volume : 100)
        }

        return player
    }

    getVolume(volume: number) {
        return volume > 200 ? 200 : 0 >= 10 ? 10 : volume
    }

    getQueue(guildId: string, init?: { node: string, channelTextId: string, channelVoiceId: string, player: Player }) {
        const cache = this.queue.get(guildId)
        if(cache) {
            if(init && cache.tracks.length === 0) {
                cache.channelTextId = init.channelTextId
                cache.node = init.node
            }

            return cache
        } else if(init) {
            this.queue.set(
                guildId,
                {
                    node: init.node,
                    player: init.player,
                    channelTextId: init.channelTextId,
                    channelVoiceId: init.channelVoiceId,
                    volume: 100,
                    messageId: '0',
                    interval: null,
                    shuffle: false,
                    isDisconnect: false,
                    pausedTimestamp: 0,
                    lastTracks: {},
                    repeat: '',
                    tracks: []
                }
            )

            return this.queue.get(guildId)!
        }
    }

    setPlayerConfig(interaction: CommandInteraction<'cached'>, messageId: string) {
        const queue = this.getQueue(interaction.guildId)
        if(queue && queue.tracks.length == 0) {
            queue.channelTextId = interaction.channelId
            queue.messageId = messageId
        }
    }

    handler() {
        this.on('ready', (name) => this.client.logger.connect(`Lavalink server ${name} is connected on cluster #${this.client.cluster.id+1}`))
    }

    async getThumbnail(uri: string): Promise<string | null> {
        if(uri.includes('open.spotify.com')) {
            const data = await fetch(
                `https://open.spotify.com/oembed?url=${uri}`
            ).then(async (res) => await res.json()).catch(() => null)
    
            if(!data) return null

            if(data.thumbnail_url) {
                return data?.thumbnail_url || null
            } else {
                return null
            }
        } else {
            return null
        }
    }

    async leaveChannel(guildId: string, type: 'Channel' | 'Queue', reason: string, name?: string) {
        const node = this.getNode(name)
        if(node) {
            const res = this.queue.get(guildId)
            if(res) {
                await node.rest.destroyPlayer(guildId)
                await this.leaveVoiceChannel(guildId)
                
                const guild = this.client.guilds.cache.get(guildId)
                
                if(guild) {
                    const channel = guild.channels.cache.get(res.channelTextId || '0')
                    if(channel?.type === ChannelType.GuildText) {
                        if(reason) {
                            await channel.send({
                                embeds: [
                                    this.client.storage.embeds
                                    .color(this.client.db.guilds.getColor(guildId))
                                    .setTitle(type === 'Channel' ? this.client.services.lang.get("commands.music.contents.leave_voice", guild.preferredLocale) : this.client.services.lang.get("commands.music.contents.server_queue", guild.preferredLocale))
                                    .setDescription(reason)
                                ]
                            }).then((msg) => {
                                setTimeout(() => msg.delete().catch(() => {}), 180_000)
                            })
                        }

                        if(res.interval) {
                            clearInterval(res.interval as NodeJS.Timeout)
                        }

                        const message = await channel.messages.fetch(res.messageId).catch(() => null)
                        if(message && res.tracks[0]) {
                            await message.edit({
                                embeds: [ this.client.storage.embeds.playerEnd(res.tracks[0], this.client.db.guilds.getColor(guildId), guild.preferredLocale, res.pausedTimestamp) ],
                                components: []
                            }).then((msg) => {
                                setTimeout(() => msg.delete().catch(() => {}), 180_000)
                            }).catch(() => message.delete().catch(() => {}))
                        }
                    }
                }

                if(node.manager.players.has(guildId)) {
                    node.manager.players.delete(guildId)
                }

                this.queue.delete(guildId)
            }
        }
    }

    getProgress(track: Track, pausedTimestamp: number, size: number = 10) {
        const emojis = this.client.emoji.music.progess
        const time = Math.trunc((Date.now() + track.info.length) - ((track.startPlaying === 0 ? Date.now() : track.startPlaying) + track.info.length) - (pausedTimestamp === 0 ? 0 : Date.now()-pausedTimestamp))
        const progress = Math.trunc(size * (time / track.info.length))

        return (
            (progress === 0 ? emojis.start : emojis.move.start)
            + (progress > 1 ? (emojis.move.full.repeat(progress) + (size-2-progress > 0 ? emojis.full.repeat(size-2-progress) : '')) : emojis.full.repeat(size-2))
            + (progress === size ? emojis.move.end : emojis.end)
        )
    }

    formatLength(length: number) {
        let s = Math.trunc(length/1000)
        let m = Math.trunc(s / 60)
        s = s - m * 60
        let h = Math.trunc(m / 60)
        m = m - h * 60

        if(h !== 0) {
            return `${10 > h ? `0${h}` : h}:${10 > m ? `0${m}` : m}:${10 > s ? `0${s}` : s}`
        } else {
            return `${10 > m ? `0${m}` : m}:${10 > s ? `0${s}` : s}`
        }
    }

    shuffle(songs: Track[], now: boolean = false) {
        const get = songs[0]

        for (let i = songs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)) as number
            [songs[i], songs[j]] = [songs[j], songs[i]]
        }

        if(now) {
            songs.splice(songs.indexOf(get), 1)
            songs.unshift(get)
        }

        return songs
    }

    playerHandler(player: Player) {
        player.on('end', async (res) => {
            const guild = this.client.guilds.cache.get(res.guildId)
            if(!guild) return this.leaveChannel(res.guildId, 'Queue', 'unknown guild')

            const queue = this.getQueue(res.guildId)
            const channel = guild.channels.cache.get(queue?.channelVoiceId || '0')
            if(queue && channel?.type === ChannelType.GuildVoice) {
                const lastTrack = queue.tracks.shift()!

                const text = guild.channels.cache.get(queue.channelTextId)
                if(text?.type === ChannelType.GuildText) {
                    if(queue.interval) {
                        clearInterval(queue.interval as NodeJS.Timeout)
                    }

                    const message = await text.messages.fetch(queue.messageId).catch(() => null)
                    if(message) {
                        await message.edit({
                            embeds: [ this.client.storage.embeds.playerEnd(lastTrack, this.client.db.guilds.getColor(res.guildId), guild.preferredLocale, queue.pausedTimestamp) ],
                            components: []
                        }).then((msg) => {
                            setTimeout(() => msg.delete().catch(() => {}), 180_000)
                        }).catch(() => message.delete().catch(() => {}))
                    }
                }

                queue.lastTracks[lastTrack.encoded] = lastTrack
                if(Object.keys(queue.lastTracks).length > 15) {
                    delete queue.lastTracks[Object.keys(queue.lastTracks)[0]]
                }

                if(queue.repeat === 'Track') {
                    queue.tracks.unshift(lastTrack)
                }

                if(queue.repeat === 'Queue') {
                    queue.tracks.push(lastTrack)
                }

                if(queue.tracks.length > 0 && !queue?.isDisconnect) {
                    return this.playTrack(channel, text?.id || '0', true)
                } else if(!queue?.isDisconnect) {
                    return this.leaveChannel(res.guildId, 'Queue', `${this.client.services.lang.get("commands.music.contents.no_track_queue", guild.preferredLocale)}`, queue.node)
                }
            } else {
                return this.leaveChannel(res.guildId, 'Queue', 'unknown text channel')
            }
        })

        player.on('start', async (res) => {
            const guild = this.client.guilds.cache.get(res.guildId)
            if(!guild) return

            const queue = this.getQueue(res.guildId)
            if(!queue) return

            if(queue.tracks.length > 0) {
                queue.tracks[0].startPlaying = Date.now()
            }

            const channel = guild.channels.cache.get(queue?.channelTextId || '0')
            if(channel?.type !== ChannelType.GuildText) return

            const message = await channel.send({
                embeds: [ this.client.storage.embeds.player(queue, player!.node!, this.client.db.guilds.getColor(res.guildId), guild.preferredLocale) ],
                components: this.client.storage.components.player(queue)
            }).catch(() => null)

            if(!message) return

            queue.messageId = message.id
    
            let timerId: any = setInterval(async () => {
                const queue = this.getQueue(res.guildId)
                if(!queue) {
                    return clearInterval(timerId)
                }
    
                const node = this.getNode(queue.node)
                const message = await channel.messages.fetch(queue.messageId).catch(() => null)
                if(!message || !node || !queue.tracks.length) {
                    return clearInterval(timerId)
                }

                return message.edit({
                    embeds: [ this.client.storage.embeds.player(queue, node, this.client.db.guilds.getColor(res.guildId), guild.preferredLocale) ],
                    components: this.client.storage.components.player(queue)
                }).catch(() => {})
            }, 5000)

            queue.interval = timerId
        })
    }
}