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
                    interaction.member, 'Установка названия',
                    'Я не нашла такое изображение...'
                )
            ],
            ephemeral: true
        })
    }

    return button.showModal(
        new ModalBuilder()
        .setCustomId(`modalWindowSetImageName.${values[1]}.${values[2]}`)
        .setTitle('Название')
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('name')
                .setLabel('Название')
                .setRequired(true)
                .setMaxLength(32)
                .setPlaceholder('Звёздочка')
                .setStyle(TextInputStyle.Short)
                .setValue(String(image.name))
            )
        )
    )
}