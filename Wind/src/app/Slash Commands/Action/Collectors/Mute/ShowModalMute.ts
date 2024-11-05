import {
    ActionRowBuilder,
    ButtonInteraction,
    CommandInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    Locale
} from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, button: ButtonInteraction<'cached'>, locale: Locale) => {
    return button.showModal(
        new ModalBuilder()
        .setCustomId(`${button.customId.split('.')[0]}.modalMute`)
        .setTitle('Заглушить')
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('time')
                .setLabel('Время:')
                .setPlaceholder('3d/2h/1m/30s')
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
            ),
            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('reason')
                .setLabel('Причина:')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false)
                .setMaxLength(128)
            )
        )
    )
}