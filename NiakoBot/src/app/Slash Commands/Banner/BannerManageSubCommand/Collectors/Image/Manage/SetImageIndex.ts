import { NiakoClient } from "../../../../../../../struct/client/NiakoClient";
import { ButtonInteraction, CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, button: ButtonInteraction<'cached'>, lang: string) => {
    await button.deferReply({ ephemeral: true })
    
    const values = button.customId.split('.')
    const doc = await client.db.modules.banner.get(interaction.guildId)
    const image = client.db.modules.banner.getImage(doc, values[1], values[2])
    if(!image) {
        return button.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Повышение индекса',
                    'Я не нашла такое изображение...'
                )
            ]
        })
    }

    const imageIndex = client.db.modules.banner.getImageIndex(doc, values[1], values[2])
    const images = client.db.modules.banner.itemsFilterImage(doc)

    if(imageIndex === images.length-1) {
        return button.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Повышение индекса',
                    'Изображение и так находится на **переднем** плане'
                )
            ]
        })
    }

    doc.items.splice(imageIndex, 1)
    doc.items.push(image)

    doc.markModified('items')
    await client.db.modules.banner.save(doc)


    return button.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Повышение индекса',
                `Вы **перенесли** изображение на **передний** план`
            )
        ]
    })
}