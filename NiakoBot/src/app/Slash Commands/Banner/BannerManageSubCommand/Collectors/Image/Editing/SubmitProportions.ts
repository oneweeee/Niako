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
                    interaction.member, 'Установка пропорций',
                    'Я не нашла такое изображение...'
                )
            ],
            ephemeral: true
        })
    }

    return button.showModal(
        new ModalBuilder()
        .setCustomId(`modalWindowSetImageProportions.${values[1]}.${values[2]}`)
        .setTitle('Пропорции')
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('width')
                .setLabel('Ширина')
                .setRequired(true)
                .setMaxLength(6)
                .setPlaceholder(String(client.util.random(10, 950)))
                .setStyle(TextInputStyle.Short)
                .setValue(String(image.width))
            ),

            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('height')
                .setLabel('Высота')
                .setRequired(true)
                .setMaxLength(6)
                .setPlaceholder(String(client.util.random(10, 530)))
                .setStyle(TextInputStyle.Short)
                .setValue(String(image.height))
            )
        )
    )
}