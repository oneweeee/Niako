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
    const text = client.db.modules.banner.getText(doc, values[1], values[2])
    if(!text) {
        return button.reply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка координат',
                    'Я не нашла такой текст...'
                )
            ],
            ephemeral: true
        })
    }

    return button.showModal(
        new ModalBuilder()
        .setCustomId(`modalWindowSetTextCoordinate.${values[1]}.${values[2]}`)
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
                .setValue(String(text.x))
            ),

            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('y')
                .setLabel('Расположение по Y')
                .setRequired(true)
                .setMaxLength(6)
                .setPlaceholder(String(client.util.random(10, 530)))
                .setStyle(TextInputStyle.Short)
                .setValue(String(text.y))
            )
        )
    )
}