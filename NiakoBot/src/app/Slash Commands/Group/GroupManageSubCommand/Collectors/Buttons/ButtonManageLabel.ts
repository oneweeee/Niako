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
    const config = doc.buttons.find((b) => b.customId === button.customId.split('.')[1])!

    return button.showModal(
        new ModalBuilder()
        .setCustomId(`modalWindowSetButtonLabel.${button.customId.split('.')[1]}`)
        .setTitle('Этикетка кнопки')
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('label')
                .setLabel('Этикетка')
                .setRequired(false)
                .setStyle(TextInputStyle.Short)
                .setValue(config.label ? config.label : '')
            )
        )
    )
}