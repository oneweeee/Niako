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
        .setCustomId(`modalWindowSetMessage`)
        .setTitle('Контент сообщения')
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('embed')
                .setLabel('Сообщение')
                .setRequired(false)
                .setPlaceholder('Сообщение в JSON формате')
                .setStyle(TextInputStyle.Paragraph)
                .setValue(doc.embed ? String(doc.embed) : JSON.stringify(client.storage.embeds.groupMessage().data))
            )
        )
    )
}