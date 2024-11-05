import { ButtonInteraction, Locale } from "discord.js";
import BaseInteraction from "#base/BaseInteraction";
import WindClient from "#client";

export default new BaseInteraction(
    { name: 'shuffle' },
    async (client: WindClient, button: ButtonInteraction<'cached'>, locale: Locale) => {
        await button.deferReply({ ephemeral: true })

        const me = await button.guild.members.fetchMe().catch(() => null)
        if(!me || !me.voice?.channelId) {
            return button.editReply({ content: `${button.user.toString()}, меня нету в голосовом канале с вами` })
        }

        if(!button.member.voice?.channelId) {
            return button.editReply({ content: `${button.user.toString()}, что-бы послушать музыку зайдите в голосовой канал <#${me.voice.channelId}>` })
        }
        
        if(me.voice.channelId !== button.member.voice.channelId) {
            return button.editReply({ content: `${button.user.toString()}, вы не находитесь со мной в голосовом канале, на данный момент я нахожусь в голосовом канале <#${me.voice.channelId}>` })
        }

        const queue = client.player.getQueue(button.guild.id)
        if(!queue || 1 >= queue.tracks.length) {
            return button.editReply({ content: `${button.user.toString()}, недостаточно треков для перемешивания` })
        }

        queue.shuffle = true
        const message = await button.channel!.messages.fetch(queue.messageId).catch(() => null)
        if(message) {
            await message.edit({
                embeds: [
                    client.storage.embeds.playerEnd(queue.tracks[0], client.db.guilds.getColor(button.guild.id), button.locale, queue.pausedTimestamp)
                ],
                components: []
            })
        }

        if(queue.interval) {
            clearInterval(queue.interval as NodeJS.Timeout)
        }

        queue.tracks = client.player.shuffle(queue.tracks)
        queue.tracks.unshift(queue.tracks[0])
        
        queue.player.stopTrack()
        
        return button.editReply({ content: `${button.user.toString()}, все треки были успешно перемешаны` })
    }
)