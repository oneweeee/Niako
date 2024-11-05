import { TPlaylist } from "#db/playlists/PlaylistSchema"
import WindClient from "#client"
import {
    ActionRowBuilder,
    ButtonInteraction,
    CommandInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    Locale
} from 'discord.js'

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, button: ButtonInteraction<'cached'>, playlists:TPlaylist[], locale: Locale) => {
    if(playlists.length >= 15) {
        return button.reply(
            { content: 'Вы **не** можете создавать больше **15** плейлистов', ephemeral: true }
        )
    }

    return button.showModal(
        new ModalBuilder()
        .setTitle('Создание плейлиста')
        .setCustomId('createPlaylist')
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setLabel('Название')
                .setCustomId('name')
                .setStyle(TextInputStyle.Short)
                .setMaxLength(24)
                .setRequired(true)
            )
        )
    )
}