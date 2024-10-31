import { NiakoClient } from "../../../../../../../struct/client/NiakoClient";
import { ButtonInteraction, CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, button: ButtonInteraction<'cached'>, lang: string) => {    
    const values = button.customId.split('.')

    const doc = await client.db.modules.banner.get(interaction.guildId)
    const i = client.db.modules.banner.getTextIndex(doc, values[1], values[2])
    if(i === -1) {
        return button.reply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Удаление текста',
                    'Я не нашла текст...'
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
            client.storage.embeds.success(
                interaction.member, 'Удаление текста',
                `Вы **удалили** текст **${client.constants.get(data.textType, lang)}**`
            )
        ],
        components: client.storage.components.leaveBack('manage', lang, true)
    })
}