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
        embeds: [
            client.storage.embeds.choose(
                interaction.member, client.db.guilds.getColor(interaction.guildId), 'Удаление плейлиста', locale,
                `Вы **уверены**, что хотите **удалить** плейлист "**${playlist.name}**"?`,
            )
        ],
        components: client.storage.components.choose(`Delete.${playlist.code}`, `info.${playlist.code}`)
    })
}