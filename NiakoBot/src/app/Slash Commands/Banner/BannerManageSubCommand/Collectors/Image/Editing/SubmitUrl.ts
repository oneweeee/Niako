import { NiakoClient } from "../../../../../../../struct/client/NiakoClient";
import {
    ActionRowBuilder,
    ButtonInteraction,
    CommandInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, button: ButtonInteraction<'cached'>, lang: string) => {
    const values = button.customId.split('.')
    
    const doc = await client.db.modules.banner.get(interaction.guildId)
    const image = client.db.modules.banner.getImage(doc, values[1], values[2])
    if(!image) {
        return button.reply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка ссылки',
                    'Я не нашла такое изображение...'
                )
            ],
            ephemeral: true
        })
    }

    return button.showModal(
        new ModalBuilder()
        .setCustomId(`modalWindowSetImageUrl.${values[1]}.${values[2]}`)
        .setTitle('Ссылка')
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('url')
                .setLabel('Ссылка')
                .setRequired(true)
                .setPlaceholder('https://media.discordapp.net/.../star.png')
                .setStyle(TextInputStyle.Short)
                .setValue(image.type !== 'ActiveMemberAvatar' && !image.url.startsWith('canvasCache') ? image.url : '')
            )
        )
    )
}