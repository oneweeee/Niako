import { NiakoClient } from "../../../../../../../struct/client/NiakoClient";
import { ButtonInteraction, CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, button: ButtonInteraction<'cached'>, lang: string) => {    
    const values = button.customId.split('.')

    const doc = await client.db.modules.banner.get(interaction.guildId)
    const i = client.db.modules.banner.getImageIndex(doc, values[1], values[2])
    if(i === -1) {
        return button.reply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Удаление изображения',
                    'Я не нашла такое изображение...'
                )
            ],
            ephemeral: true
        })
    }
    
    const data = doc.items[i] as any

    doc.items.splice(i, 1)
    doc.markModified('items')
    await client.db.modules.banner.save(doc)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, 'Удаление изображения',
                `Вы **удалили** изображение **${data.name}**`
            )
        ],
        components: client.storage.components.leaveBack('manage', lang, true)
    })
}