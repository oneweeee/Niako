import { NiakoClient } from "../../../../../../../struct/client/NiakoClient";
import { CommandInteraction, ModalSubmitInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
    await modal.deferReply({ ephemeral: true })
    
    const values = modal.customId.split('.')
    const size = modal.fields.getTextInputValue('size')

    const doc = await client.db.modules.banner.get(interaction.guildId)
    const text = client.db.modules.banner.getText(doc, values[1], values[2])
    if(!text) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка размера',
                    'Я не нашла текст...'
                )
            ]
        })
    }

    if(client.util.isNumber(size, { minChecked: 1, maxChecked: 100 })) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка размера',
                    'Минимальное **число** установки размера **1**, а максимальное - **100**'
                )
            ]
        })
    }

    if(text.size === Number(size)) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка размера',
                    'У Вас уже **установлен** такой размер'
                )
            ]
        })
    }

    await interaction.editReply({ embeds: [ client.storage.embeds.loading(lang) ], components: [], files: [] })

    text.size = Number(size)

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
                interaction.member, 'Установка размера',
                `Вы установили размер текста **${size}**`
            )
        ]
    })
}