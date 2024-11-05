import { ButtonInteraction, Locale } from "discord.js";
import BaseInteraction from "#base/BaseInteraction";
import WindClient from "#client";

export default new BaseInteraction(
    { name: 'seekStart' },
    async (client: WindClient, button: ButtonInteraction<'cached'>, locale: Locale) => {
        const me = await button.guild.members.fetchMe().catch(() => null)
        if(!me || !me.voice?.channelId) {
            return button.reply({ content: `${button.user.toString()}, меня нету в голосовом канале с вами`, ephemeral: true })
        }

        if(!button.member.voice?.channelId) {
            return button.reply({ content: `${button.user.toString()}, что-бы послушать музыку зайдите в голосовой канал <#${me.voice.channelId}>`, ephemeral: true })
        }

        if(me.voice.channelId !== button.member.voice.channelId) {
            return button.reply({ content: `${button.user.toString()}, вы не находитесь со мной в голосовом канале, на данный момент я нахожусь в голосовом канале <#${me.voice.channelId}>`, ephemeral: true })
        }

        const queue = client.player.getQueue(button.guildId)
        if(!queue || !queue.tracks.length) {
            return button.reply({ content: `${button.user.toString()}, пустая очередь`, ephemeral: true })
        }

        queue.tracks[0].startPlaying = Date.now()
        queue.player.seekTo(0)

        return button.update({
            embeds: [
                client.storage.embeds.manageSeek(queue, client.db.guilds.getColor(button.guild.id), button.locale)
            ]
        })
    }
)