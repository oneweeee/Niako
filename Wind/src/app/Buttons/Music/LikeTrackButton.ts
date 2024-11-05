import { ButtonInteraction, Locale } from "discord.js";
import BaseInteraction from "#base/BaseInteraction";
import WindClient from "#client";

export default new BaseInteraction(
    { name: 'likeTrack' },
    async (client: WindClient, button: ButtonInteraction<'cached'>, locale: Locale) => {
        await button.deferReply({ ephemeral: true })

        const me = await button.guild.members.fetchMe().catch(() => null)
        if(!me || !me.voice?.channelId) {
            return button.editReply({ content: `${button.user.toString()}, меня нету в голосовом канале с вами` })
        }

        const queue = client.player.getQueue(button.guildId)
        if(!queue || !queue.tracks.length) {
            return button.editReply({ content: `${button.user.toString()}, пустая очередь` })
        }

        await client.db.playlists.checkLoveTracks(button.user.id)

        const playlists = await client.db.playlists.getOnlyUser(button.user.id)
        
        return button.editReply({
            embeds: [
                client.storage.embeds.default(
                    button.member, client.db.guilds.getColor(button.guild.id), 'Понравишиеся',
                    button.locale, `в каком плейлисте **хотите** сохранить данный трек?`
                )
            ],
            components: client.storage.components.playlists(playlists, button.guild, false, queue.tracks[0].info.uri)
        })
    }
)