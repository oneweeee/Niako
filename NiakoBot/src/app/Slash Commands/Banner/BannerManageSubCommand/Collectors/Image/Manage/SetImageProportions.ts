import { NiakoClient } from "../../../../../../../struct/client/NiakoClient";
import { CommandInteraction, ModalSubmitInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
    await modal.deferReply({ ephemeral: true })
    
    const values = modal.customId.split('.')
    const width = modal.fields.getTextInputValue('width')
    const height = modal.fields.getTextInputValue('height')

    const doc = await client.db.modules.banner.get(interaction.guildId)
    const image = client.db.modules.banner.getImage(doc, values[1], values[2])
    if(!image) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка пропорций',
                    'Я не нашла такое изображение...'
                )
            ]
        })
    }

    if(client.util.isNumber(width, { maxChecked: 960 }) || client.util.isNumber(height, { maxChecked: 540 })) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка пропорций',
                    'Вы **не** можете установить **координаты** больше **960** по **x** и **540** по **y**'
                )
            ]
        })
    }

    if(image.width === Number(width) && image.height === Number(height)) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка пропорций',
                    'У Вас уже **установлены** такие пропорции'
                )
            ]
        })
    }

    await interaction.editReply({ embeds: [ client.storage.embeds.loading(lang) ], components: [], files: [] })

    image.width = Number(width)
    image.height = Number(height)

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
                interaction.member, 'Установка пропорций',
                `Вы **установили** пропорции ширина **${width}**, высота **${height}**`
            )
        ]
    })
}