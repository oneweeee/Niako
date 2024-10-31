import { NiakoClient } from "../../struct/client/NiakoClient";
import { TrackStartEvent } from "shoukaku";
import { ChannelType } from "discord.js";

export default async (client: NiakoClient, data: TrackStartEvent) => {
    const guild = client.guilds.cache.get(data.guildId)
    if(!guild) return

    const queue = await client.db.queues.get(guild.id)
    if(queue.textId === '0') return
    
    const channel = guild.channels.cache.get(queue.textId)
    if(!channel || channel.type !== ChannelType.GuildText) return

    const track = client.db.queues.getTrack(queue, data.track)
    if(!track) return

    track.start = Date.now()

    return channel.send({
        embeds: [ client.storage.embeds.player(queue, track) ],
        components: client.storage.components.player(queue, client.user.id)
    }).then(async (message) => {
        const queue = await client.db.queues.get(guild.id)
        
        const oldMessage = await channel.messages.fetch(queue.messageId).catch(() => undefined)
        if(oldMessage) await oldMessage.delete().catch(() => {})

        queue.messageId = message.id
        await client.db.queues.save(queue)

        const int = setInterval(async () => {
            if(queue.messageId === '0') {
                await message.delete().catch(() => {})
                clearInterval(int)
            }
            
            await message.edit({
                embeds: [ client.storage.embeds.player(queue, track) ],
                components: client.storage.components.player(queue, client.user.id)
            }).catch(async () => {await message.delete().catch(() => {}); clearInterval(int)})
        }, 5_000)
    })
}