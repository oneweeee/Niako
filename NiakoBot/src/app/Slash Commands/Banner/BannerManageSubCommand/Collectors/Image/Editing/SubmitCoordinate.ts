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
                    interaction.member, 'Установка координат',
                    'Я не нашла такое изображение...'
                )
            ],
            ephemeral: true
        })
    }

    return button.showModal(
        new ModalBuilder()
        .setCustomId(`modalWindowSetImageCoordinate.${values[1]}.${values[2]}`)
        .setTitle('Координаты')
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('x')
                .setLabel('Расположение по X')
                .setRequired(true)
                .setMaxLength(6)
                .setPlaceholder(String(client.util.random(10, 950)))
                .setStyle(TextInputStyle.Short)
                .setValue(String(image.x))
            ),

            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('y')
                .setLabel('Расположение по Y')
                .setRequired(true)
                .setMaxLength(6)
                .setPlaceholder(String(client.util.random(10, 540)))
                .setStyle(TextInputStyle.Short)
                .setValue(String(image.y))
            )
        )
    )
}