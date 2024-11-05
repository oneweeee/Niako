import { CommandInteraction, ModalSubmitInteraction, Locale } from "discord.js"
import { TPlaylist } from "#db/playlists/PlaylistSchema"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, playlists: TPlaylist[], locale: Locale) => {
    const playlist = playlists.find(p => modal.customId.split('.')[1] === p.code)
    if(!playlist) {
        return modal.reply(
            { content: 'Я **не** нашел такой **плейлист** :(', ephemeral: true }
        )
    }

    const oldName = playlist.name
    playlist.name = modal.fields.getTextInputValue('name')
    await client.db.playlists.save(playlist)

    await client.db.playlists.save(playlist)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), 'Управление плейлистом', locale,
                `Вы **установили** новое **название** плейлиста **${oldName}** на **${playlist.name}**`,
            )
        ],
        components: client.storage.components.leaveManagePlaylist(playlist, locale)
    })
}