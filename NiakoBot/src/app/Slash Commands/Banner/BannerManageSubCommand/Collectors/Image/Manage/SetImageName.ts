import { NiakoClient } from "../../../../../../../struct/client/NiakoClient";
import { CommandInteraction, ModalSubmitInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
    await modal.deferReply({ ephemeral: true })
    
    const values = modal.customId.split('.')
    const name = modal.fields.getTextInputValue('name')

    const doc = await client.db.modules.banner.get(interaction.guildId)
    const image = client.db.modules.banner.getImage(doc, values[1], values[2])
    if(!image) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка названия',
                    'Я не нашла такое изображение...'
                )
            ]
        })
    }

    await interaction.editReply({ embeds: [ client.storage.embeds.loading(lang) ], components: [], files: [] })

    image.name = name

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
                interaction.member, 'Установка названия',
                `Вы **установили** название **${name}**`
            )
        ]
    })
}