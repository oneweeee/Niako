import { NiakoClient } from "../../../../../../../struct/client/NiakoClient";
import { CommandInteraction, ModalSubmitInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
    await modal.deferReply({ ephemeral: true })
    
    const values = modal.customId.split('.')
    const width = modal.fields.getTextInputValue('width')

    const doc = await client.db.modules.banner.get(interaction.guildId)
    const text = client.db.modules.banner.getText(doc, values[1], values[2])
    if(!text) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка ширины',
                    'Я не нашла текст...'
                )
            ]
        })
    }

    if(client.util.isNumber(width, { maxChecked: 960 })) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка ширины',
                    'Минимальное **число** установки ширины - **10**, а максимальная - **960**'
                )
            ]
        })
    }

    if(text.width === Number(width)) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка ширины',
                    'У Вас уже **установлена** такая ширина'
                )
            ]
        })
    }

    await interaction.editReply({ embeds: [ client.storage.embeds.loading(lang) ], components: [], files: [] })

    text.width = Number(width) === 0 ? 'None' : Number(width)

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
                interaction.member, 'Установка ширины',
                `Вы установили ширину **${width}**`
            )
        ]
    })
}