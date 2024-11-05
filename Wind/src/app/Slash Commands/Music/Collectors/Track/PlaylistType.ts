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
    let state: boolean

    if(playlist.type === 'Private') {
        playlist.type = 'Public'
        state = true
    } else {
        playlist.type = 'Private'
        state = false
    }

    await client.db.playlists.save(playlist)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), 'Управление плейлистом', locale,
                `Вы **изменили** тип плейлиста на **${state?'публичный':'приватный'}**`,
            )
        ],
        components: client.storage.components.leaveManagePlaylist(playlist, locale)
    })
}