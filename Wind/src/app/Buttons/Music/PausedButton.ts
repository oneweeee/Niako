import { ButtonInteraction, Locale } from "discord.js";
import BaseInteraction from "#base/BaseInteraction";
import WindClient from "#client";

export default new BaseInteraction(
    { name: 'paused' },
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

        const paused = !queue.player.paused
        queue.player.setPaused(paused)

        if(paused) {
            queue.pausedTimestamp = Date.now()
        } else {
            queue.tracks[0].startPlaying += (Date.now() - queue.pausedTimestamp)
            queue.pausedTimestamp = 0
        }
        
        return button.editReply({ content: `${paused ? `${button.user.toString()}, вы поставили на паузу трек` : `${button.user.toString()}, вы продолжили воспроизведения трека`}` })
    }
)