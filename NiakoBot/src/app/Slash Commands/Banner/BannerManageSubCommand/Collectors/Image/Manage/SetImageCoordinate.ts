import { NiakoClient } from "../../../../../../../struct/client/NiakoClient";
import { CommandInteraction, ModalSubmitInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
    await modal.deferReply({ ephemeral: true })
    
    const values = modal.customId.split('.')
    const x = modal.fields.getTextInputValue('x')
    const y = modal.fields.getTextInputValue('y')

    const doc = await client.db.modules.banner.get(interaction.guildId)
    const image = client.db.modules.banner.getImage(doc, values[1], values[2])
    if(!image) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка координат',
                    'Я не нашла такое изображение...'
                )
            ]
        })
    }

    if(client.util.isNumber(x, { maxChecked: 960 }) || client.util.isNumber(y, { maxChecked: 540 })) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка кординат',
                    'Вы **не** можете установить **координаты** больше **960** по **x** и **540** по **y**'
                )
            ]
        })
    }

    if(image.x === Number(x) && image.y === Number(y)) {
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

    image.x = Number(x)
    image.y = Number(y)

    doc.markModified('items')
    await client.db.modules.banner.save(doc)

    const data = await client.storage.embeds.bannerManageImage(interaction.member, doc, image, lang)

    await interaction.editReply({
        ...data,
        components: client.storage.components.manageImage(image, lang),
    })


    return modal.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Установка координат',
                `Вы **установили** координаты x **${x}**, y **${y}**`
            )
        ]
    })
}