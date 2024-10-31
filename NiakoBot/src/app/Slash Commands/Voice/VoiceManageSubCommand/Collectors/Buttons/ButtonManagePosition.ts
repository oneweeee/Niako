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
    const doc = await client.db.modules.voice.get(interaction.guildId)
    const config = client.db.modules.voice.getButtonConfig(doc, button.customId.split('.')[1] as any)

    return button.showModal(
        new ModalBuilder()
        .setCustomId(`modalWindowSetButtonPosition.${button.customId.split('.')[1]}`)
        .setTitle('Позиция кнопки')
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('row')
                .setLabel('Ряд')
                .setRequired(false)
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('0')
                .setMaxLength(1)
                .setValue(String(config.position.row))
            ),
            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('button')
                .setLabel('Место')
                .setRequired(false)
                .setPlaceholder('1')
                .setMaxLength(1)
                .setStyle(TextInputStyle.Short)
                .setValue(String(config.position.button))
            )
        )
    )
}