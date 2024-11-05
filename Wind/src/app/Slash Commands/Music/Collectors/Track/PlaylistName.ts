import { TPlaylist } from "#db/playlists/PlaylistSchema"
import WindClient from "#client"
import {
    CommandInteraction,
    ButtonInteraction,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    Locale
} from "discord.js"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, button: ButtonInteraction<'cached'>, playlists: TPlaylist[], locale: Locale) => {
    const playlist = playlists.find(p => button.customId.split('.')[1] === p.code)
    if(!playlist) {
        return button.reply(
            { content: 'Я **не** нашел такой **плейлист** :(', ephemeral: true }
        )
    }

    return button.showModal(
        new ModalBuilder()
        .setCustomId(button.customId)
        .setTitle('Название плейлиста')
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('name')
                .setLabel('Название')
                .setStyle(TextInputStyle.Short)
                .setMaxLength(32)
                .setPlaceholder(playlist.name)
                .setRequired(true)
            )
        )
    )
}