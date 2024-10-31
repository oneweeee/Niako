import { NiakoClient } from "../../../../../../../struct/client/NiakoClient";
import { ButtonInteraction, CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, button: ButtonInteraction<'cached'>, lang: string) => {    
    const values = button.customId.split('.')

    const doc = await client.db.modules.banner.get(interaction.guildId)
    const image = client.db.modules.banner.getImage(doc, values[1], values[2])
    if(!image) {
        return button.reply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Скрытие/Раскрытие изображения',
                    'Я не нашла такое изображение...'
                )
            ],
            ephemeral: true
        })
    }

    const res = client.db.boosts.getMaxCountTextsOnBanner(interaction.guildId)
    const images = client.db.modules.banner.itemsFilterImage(doc, true)
    if(images.length > res.count && image.disabled) {
        return button.reply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Скрытие/Раскрытие изображения',
                    `Вы **не** можете **раскрыть** изображение, так как у Вас **недостаточен** уровень.\n> Повысьте **уровень** сервера, чтобы **раскрыть** текст`
                )
            ],
            ephemeral: true
        })
    }
    
    image.disabled = !image.disabled

    doc.markModified('items')
    await client.db.modules.banner.save(doc)

    return interaction.editReply({
        components: client.storage.components.manageImage(image, lang),
    })
}