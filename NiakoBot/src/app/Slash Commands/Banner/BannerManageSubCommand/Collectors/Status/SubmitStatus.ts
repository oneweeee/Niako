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
    const doc = await client.db.modules.banner.get(interaction.guildId)
    return button.showModal(
        new ModalBuilder()
        .setCustomId('modalWindowSetDefaultStatus')
        .setTitle('Статус по умолчанию')
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('status')
                .setLabel('Статус')
                .setMaxLength(64)
                .setPlaceholder('Статус не установлен')
                .setRequired(true)
                .setStyle(TextInputStyle.Short)
                .setValue(doc.status)
            )
        )
    )
}