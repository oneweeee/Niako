import { NiakoClient } from "../../../../../../../struct/client/NiakoClient";
import { CommandInteraction, ModalSubmitInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
    await modal.deferReply({ ephemeral: true })
    
    const values = modal.customId.split('.')
    const url = modal.fields.getTextInputValue('url')

    const doc = await client.db.modules.banner.get(interaction.guildId)
    const image = client.db.modules.banner.getImage(doc, values[1], values[2])
    if(!image) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка ссылки',
                    'Я не нашла такое изображение...'
                )
            ]
        })
    }

    const formates = client.canvas.imageFormates.find((format) => url.endsWith(format))
    if(!formates) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка ссылки',
                    `Ссылка **должна** заканчиваться на **один** из этих вариантов: ${client.canvas.imageFormates.map((f) => `**${f}**`).join(', ')}`
                )
            ]
        })
    }

    const state = await client.canvas.loadImageState(url)
    if(!state) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка ссылки',
                    `Ссылка **недействительна** или **устарела**`
                )
            ]
        })
    }

    await interaction.editReply({ embeds: [ client.storage.embeds.loading(lang) ], components: [], files: [] })

    image.url = url

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
                interaction.member, 'Установка ссылки',
                `Вы установили [ссылку](${url}) на изображения`
            )
        ]
    })
}