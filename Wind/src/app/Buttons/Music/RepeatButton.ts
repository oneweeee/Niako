import { ButtonInteraction, Locale } from "discord.js";
import BaseInteraction from "#base/BaseInteraction";
import WindClient from "#client";

export default new BaseInteraction(
    { name: 'repeat' },
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
        if(!queue || !queue.tracks.length) {
            return button.editReply({ content: `${button.user.toString()}, пустая очередь` })
        }

        let repeat = queue.repeat
        let name = ''
        if(!repeat) {
            repeat = 'Queue'
            name = `${button.user.toString()}, вы включили повтор очереди треков`
        } else if(repeat === 'Queue') {
            repeat = 'Track'
            name = `${button.user.toString()}, вы включили повтор данного трека`
        } else {
            repeat = ''
            name = `${button.user.toString()}, вы отключили повтор треков`
        }

        queue.repeat = repeat
        
        return button.editReply({ content: name })
    }
)