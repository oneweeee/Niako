import { CommandInteraction, ButtonInteraction, Locale } from "discord.js"
import { TPlaylist } from "#db/playlists/PlaylistSchema"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, button: ButtonInteraction<'cached'>, playlists: TPlaylist[], locale: Locale) => {
    const playlist = playlists.find(p => button.customId.split('.')[1] === p.code)
    if(!playlist) {
        return button.reply(
            { content: 'Я **не** нашел такой **плейлист** :(', ephemeral: true }
        )
    }

    return interaction.editReply({
        embeds: [ client.storage.embeds.playlistTracks(interaction, client.db.guilds.getColor(interaction.guildId), playlist, locale) ],
        components: [
            ...client.storage.components.selectRemoveTrack(playlist, locale),
            ...client.storage.components.paginator(playlist.tracks, { page: 0, count: 8, extra: false, trash: false, endsWith: `Playlist.${playlist.code}` }),
            ...client.storage.components.leaveManagePlaylist(playlist, locale)
        ]
    })
}