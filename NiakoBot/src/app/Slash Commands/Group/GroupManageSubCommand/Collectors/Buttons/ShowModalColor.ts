import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import {
    ActionRowBuilder,
    ButtonInteraction,
    CommandInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, button: ButtonInteraction<'cached'>, lang: string) => {
    const doc = await client.db.modules.group.get(interaction.guildId)

    return button.showModal(
        new ModalBuilder()
        .setCustomId(`modalWindowSetColor`)
        .setTitle('Цвет')
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('color')
                .setLabel('Цвет')
                .setRequired(false)
                .setMaxLength(7)
                .setMinLength(7)
                .setPlaceholder(`#2B2D31`)
                .setStyle(TextInputStyle.Short)
                .setValue(String(doc.color))
            )
        )
    )
}