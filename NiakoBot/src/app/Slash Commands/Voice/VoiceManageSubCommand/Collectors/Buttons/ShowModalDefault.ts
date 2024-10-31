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

    return button.showModal(
        new ModalBuilder()
        .setCustomId(`modalWindowSetDefault`)
        .setTitle('Настройка по умолчанию')
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('name')
                .setLabel('Название')
                .setRequired(false)
                .setMaxLength(32)
                .setPlaceholder('$username')
                .setStyle(TextInputStyle.Short)
                .setValue(String(doc.default.roomName))
            ),

            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('limit')
                .setLabel('Лимит')
                .setRequired(false)
                .setMaxLength(2)
                .setPlaceholder('0')
                .setStyle(TextInputStyle.Short)
                .setValue(String(doc.default.roomLimit))
            ),

            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('roleId')
                .setLabel('Роль')
                .setRequired(false)
                .setMaxLength(19)
                .setMinLength(18)
                .setPlaceholder(interaction.guildId)
                .setStyle(TextInputStyle.Short)
                .setValue(String(doc.default.roleId || interaction.guildId))
            )
        )
    )
}