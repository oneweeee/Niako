import { ButtonInteraction, Locale } from "discord.js";
import BaseInteraction from "#base/BaseInteraction";
import WindClient from "#client";

export default new BaseInteraction(
    { name: 'forwardTrack' },
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

        /*if(queue.tracks.length === 1) {
            return button.editReply({ content: `${button.user.toString()}, в очереди нет треков для перемотки` })
        }*/

        const cd = client.db.skips.get(`${button.guildId}.${button.user.id}`)
        if((cd || 0) > Date.now()) {
            return button.editReply({ content: `${button.user.toString()}, попробуйте воспользоваться данной кнопки <t:${Math.round(cd! / 1000)}:R>` })
        }

        if(queue.tracks.length === 0) {
            queue.isDisconnect = true
        }

        await queue.player.stopTrack()
        client.db.skips.set(`${button.guildId}.${button.user.id}`, Date.now() + 30000)

        return button.editReply({ content: `${button.user.toString()}, вы перемотали на 1 трек вперед` })
    }
)