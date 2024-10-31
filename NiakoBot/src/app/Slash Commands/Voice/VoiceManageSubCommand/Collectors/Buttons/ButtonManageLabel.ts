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