import { StringSelectMenuInteraction, Locale } from "discord.js";
import BaseInteraction from "#base/BaseInteraction";
import WindClient from "#client";

export default new BaseInteraction(
    { name: 'backLastTrack' },
    async (client: WindClient, menu: StringSelectMenuInteraction<'cached'>, locale: Locale) => {
        await menu.deferReply({ ephemeral: true })

        const me = await menu.guild.members.fetchMe().catch(() => null)
        if(!me || !me.voice?.channelId) {
            return menu.editReply({ content: `${menu.user.toString()}, меня нету в голосовом канале с вами` })
        }

        if(!menu.member.voice?.channelId) {
            return menu.editReply({ content: `${menu.user.toString()}, что-бы послушать музыку зайдите в голосовой канал <#${me.voice.channelId}>` })
        }

        if(me.voice.channelId !== menu.member.voice.channelId) {
            return menu.editReply({ content: `${menu.user.toString()}, вы не находитесь со мной в голосовом канале, на данный момент я нахожусь в голосовом канале <#${me.voice.channelId}>` })
        }

        const queue = client.player.getQueue(menu.guild.id)
        if(!queue || !queue.tracks.length) {
            return menu.editReply({ content: `${menu.user.toString()}, пустая очередь` })
        }

        const track = Object.values(queue.lastTracks).find((t) => t.info.uri === menu.values[0])
        if(!track) {
            return menu.editReply({ content: `${menu.user.toString()}, трек не был найден` })
        }

        queue.tracks.splice(0, 1, queue.tracks[0], track)
        delete queue.lastTracks[track.encoded]
        queue.player.stopTrack()
        
        return menu.editReply({ content: `${menu.user.toString()}, был выбран другой трек` })
    }
)