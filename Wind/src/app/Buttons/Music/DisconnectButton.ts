import { ButtonInteraction, Locale } from "discord.js";
import BaseInteraction from "#base/BaseInteraction";
import WindClient from "#client";

export default new BaseInteraction(
    { name: 'disconnect' },
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

        const queue = client.player.getQueue(button.guildId)
        if(!queue || !queue.tracks.length) {
            return button.editReply({ content: `${button.user.toString()}, пустая очередь` })
        }

        queue.isDisconnect = true
        await client.player.leaveChannel(button.guildId, 'Queue', `${button.user.toString()}, вы закончили проигрывание, нажав на кнопку дисконнекта`)
        
        return button.editReply({ content: `${button.user.toString()}, проигрывание музыки в голосовом канале была закончено` })
    }
)