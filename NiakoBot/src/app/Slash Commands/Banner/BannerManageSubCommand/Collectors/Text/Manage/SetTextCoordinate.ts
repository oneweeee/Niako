import { NiakoClient } from "../../../../../../../struct/client/NiakoClient";
import { CommandInteraction, ModalSubmitInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
    await modal.deferReply({ ephemeral: true })
    
    const values = modal.customId.split('.')
    const x = modal.fields.getTextInputValue('x')
    const y = modal.fields.getTextInputValue('y')

    const doc = await client.db.modules.banner.get(interaction.guildId)
    const text = client.db.modules.banner.getText(doc, values[1], values[2])
    if(!text) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка координат',
                    'Я не нашла текст...'
                )
            ]
        })
    }

    if(client.util.isNumber(x, { maxChecked: 960 }) || client.util.isNumber(y, { maxChecked: 540 })) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка координат',
                    'Вы **не** можете установить **координаты** больше **960** по **x** и **540** по **y**'
                )
            ]
        })
    }

    if(text.x === Number(x) && text.y === Number(y)) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка координат',
                    'У Вас уже **установлены** такие координаты'
                )
            ]
        })
    }

    await interaction.editReply({ embeds: [ client.storage.embeds.loading(lang) ], components: [], files: [] })

    text.x = Number(x)
    text.y = Number(y)

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
                interaction.member, 'Установка координат',
                `Вы установили координаты x **${x}**, y **${y}**`
            )
        ]
    })
}