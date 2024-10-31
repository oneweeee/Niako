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
                    interaction.member, 'Закругление изображения',
                    'Я не нашла такое изображение...'
                )
            ]
        })
    }

    await interaction.editReply({ embeds: [ client.storage.embeds.loading(lang) ], components: [], files: [] })
    
    image.shape = !image.shape

    doc.markModified('items')
    await client.db.modules.banner.save(doc)

    const data = await client.storage.embeds.bannerManageImage(interaction.member, doc, image, lang)

    await interaction.editReply({
        ...data,
        components: client.storage.components.manageImage(image, lang),
    })

    return button.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Закругление изображения',
                `Вы **${image.shape ? 'закруглили' : 'раскруглили'}** изображение`
            )
        ]
    })
}