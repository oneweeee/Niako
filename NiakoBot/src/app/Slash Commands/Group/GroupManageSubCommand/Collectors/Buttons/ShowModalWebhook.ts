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
        .setCustomId(`modalWindowSetWebhook`)
        .setTitle('Настройка вебхука')
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('name')
                .setLabel('Название')
                .setRequired(false)
                .setPlaceholder(client.user.username)
                .setMaxLength(80)
                .setStyle(TextInputStyle.Short)
                .setValue(String(doc.webhook.username))
            ),

            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('avatar')
                .setLabel('Аватар')
                .setRequired(false)
                .setPlaceholder('https://media.discordapp.net/.../avatar.png')
                .setStyle(TextInputStyle.Paragraph)
                .setValue(doc.webhook.avatar.startsWith('https://') ? doc.webhook.avatar : '')
            )
        )
    )
}