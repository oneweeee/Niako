import { NiakoClient } from "../../../../../../../struct/client/NiakoClient";
import { CommandInteraction, ModalSubmitInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
    await modal.deferReply({ ephemeral: true })
    
    const values = modal.customId.split('.')
    const color = modal.fields.getTextInputValue('color')

    const doc = await client.db.modules.banner.get(interaction.guildId)
    const text = client.db.modules.banner.getText(doc, values[1], values[2])
    if(!text) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка цвета',
                    'Я не нашла текст...'
                )
            ]
        })
    }

    if(color.length !== 7 || !color.startsWith('#')) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка цвета',
                    'Вы **должны** указать **HEX-код** цвета размером в **7** символов'
                )
            ]
        })
    }

    if(text.color === color) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка цвет',
                    'У Вас уже **установлен** такой цвет'
                )
            ]
        })
    }

    await interaction.editReply({ embeds: [ client.storage.embeds.loading(lang) ], components: [], files: [] })

    text.color = color

    doc.markModified('items')
    await client.db.modules.banner.save(doc)

    const data = await client.storage.embeds.bannerManageText(interaction.member, doc, text, lang)

    await interaction.editReply({
        ...data,
        components: client.storage.components.manageText(text, lang),
    })


    return modal.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Установка цвета',
                `Вы установили цвет **${color}**`
            )
        ]
    })
}