import { INiakoTrack, IQueue } from "../../db/queue/QueueSchema";
import { Shoukaku, Connectors } from "shoukaku";
import { NiakoClient } from "./NiakoClient";
import { GuildMember } from "discord.js";
import fetch from "node-fetch";

export default class NiakoPlayer extends Shoukaku {
    constructor(
        private readonly client: NiakoClient
    ) {
        super(
            new Connectors.DiscordJS(client),
            [
                //{ name: '127.0.0.1', url: '127.0.0.1:1234', auth: 'huila228Niako' }
            ]
        )

        this.on('error', (_, error) => {});
        this.on('ready', (name) => this.client.logger.success(`Node ${name} is connected on cluster #${this.client.cluster.id+1}`))
    }

    shuffle(songs: INiakoTrack[], now: boolean = false) {
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

    resolveProvider(member: GuildMember) {
        const channel = member.voice.channel
        if(!channel) return null

        return channel.members.find((m) => m.id === this.client.user.id) || null
    }

    async getSpotiyThumbnail(url: string) {
        const { getPreview } = require('spotify-url-info')(fetch)

        const res = await getPreview(url)

        return res
    }

    resolveLastTracks(queue: IQueue, skiping: INiakoTrack | undefined) {
        if(!skiping) return

        queue.lasts[skiping!.track] = skiping
        if(Object.keys(queue.lasts).length > 5) {
            delete queue.lasts[Object.keys(queue.lasts)[0]]
        }
    }

    progressVideoBar(time: number, duration: number, size: number = 10) {
        const resolveProgress = Math.round(size * (time / duration))
        const progress = 0 > resolveProgress ? 0 : size >= resolveProgress ? resolveProgress : size
        const emojis = this.client.config.emojis.music.progess

        return (
            (progress === 0 ? emojis.start : emojis.move.start)
            + (progress > 1 ? (emojis.move.full.repeat(progress) + (size-2-progress > 0 ? emojis.full.repeat(size-2-progress) : '')) : emojis.full.repeat(size-2))
            + (progress === size ? emojis.move.end : emojis.end)
        )
    }

    convertVideoLength(length: any) {
        const number = Number(length)
        
        let s = Math.trunc(number/1000)
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
}