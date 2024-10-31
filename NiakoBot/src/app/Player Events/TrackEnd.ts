import { NiakoClient } from "../../struct/client/NiakoClient";
import { TrackEndEvent } from "shoukaku";
import { ChannelType } from "discord.js";

export default async (client: NiakoClient, data: TrackEndEvent) => {
    const guild = client.guilds.cache.get(data.guildId)
    if(!guild) return

    const queue = await client.db.queues.get(guild.id)
    
    if(data.reason === 'REPLACED') {
        queue.paused = false
        queue.pausedTimestamp = 0

        const channel = guild.channels.cache.get(queue.textId)
        if(!channel || channel.type !== ChannelType.GuildText) return
    
        const message = await channel.messages.fetch(queue.messageId).catch(() => {})
        if(message && message?.deletable) {
            await message.delete().catch(() => {})
        }

        return
    }

    const player = client.player.players.get(guild.id)
    if(!player) return

    queue.paused = false
    queue.pausedTimestamp = 0

    const song = queue.tracks[0]
    if(!song) return

    const channel = guild.channels.cache.get(queue.textId)
    if(!channel || channel.type !== ChannelType.GuildText) return

    const message = await channel.messages.fetch(queue.messageId).catch(() => {})
    if(message && message?.deletable) {
        await message.delete().catch(() => {})
    }

    queue.lasts[song.track] = song
    if(Object.keys(queue.lasts).length > 5) {
        delete queue.lasts[Object.keys(queue.lasts)[4]]
    }

    if(queue.repeat === 'Track') {
        song.start = Date.now()
        await client.db.queues.save(queue)
        return player.playTrack({ track: song.track })
    }

    if(queue.repeat === 'Queue' && queue.tracks.length > 1) {
        queue.tracks.push(queue.tracks.shift()!)
        queue.tracks[0].start = Date.now()
        await client.db.queues.save(queue)
        return player.playTrack({ track: queue.tracks[0].track })
    }

    queue.tracks.shift()
    
    if(queue.tracks.length > 0) {
        queue.tracks[0].start = Date.now()
        await client.db.queues.save(queue)

        return player.playTrack({ track: queue.tracks[0].track })
    } else {
        await channel.send({
            embeds: [
                client.storage.embeds.music(
                    'Треков в очереди не осталось. Я вышел с голосвого канала...'
                )
            ]
        })

        const node = client.player.getNode()!

        queue.tracks = []
        queue.lasts = {}
        queue.played = false
        queue.paused = false
        queue.pausedTimestamp = 0
        queue.filter = ''
        queue.volume = 0.5
        queue.voiceId = '0'
        queue.textId = '0'
        queue.repeat = 'None'

        node.leaveChannel(guild.id)
        return node.players.delete(guild.id)
    }
}