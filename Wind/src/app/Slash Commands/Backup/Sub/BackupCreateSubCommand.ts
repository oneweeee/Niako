import {
    CommandInteraction,
    ModalBuilder,
    ActionRowBuilder,
    TextInputBuilder,
    TextInputStyle,
    Locale
} from "discord.js";
import WindClient from "#client";

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, locale: Locale) => {
    return interaction.showModal(
        new ModalBuilder()
        .setCustomId('modalBackupCreate')
        .setTitle(`${client.services.lang.get("commands.backup.create_copy", locale)}`)
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('name')
                .setLabel(`${client.services.lang.get("commands.backup.name", locale)}:`)
                .setMaxLength(32)
                .setPlaceholder(
                    client.util.resolveString(interaction.guild.name, 32)
                )
                .setRequired(false)
                .setStyle(TextInputStyle.Short)
            )
        )
    )
}