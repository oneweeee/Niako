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
                    interaction.member, 'Установка размера',
                    'Я не нашла такой текст...'
                )
            ],
            ephemeral: true
        })
    }

    return button.showModal(
        new ModalBuilder()
        .setCustomId(`modalWindowSetTextWidth.${values[1]}.${values[2]}`)
        .setTitle('Ширина')
        .addComponents(
            new ActionRowBuilder<TextInputBuilder>()
            .addComponents(
                new TextInputBuilder()
                .setCustomId('width')
                .setLabel('Ширина')
                .setRequired(true)
                .setMaxLength(3)
                .setPlaceholder(String(client.util.random(100, 960)))
                .setStyle(TextInputStyle.Short)
                .setValue(text.width === 'None' ? '' : String(text.width))
            )
        )
    )
}