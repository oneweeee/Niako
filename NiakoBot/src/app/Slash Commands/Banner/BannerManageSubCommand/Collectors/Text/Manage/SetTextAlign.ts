import { CommandInteraction, StringSelectMenuInteraction } from "discord.js";
import { NiakoClient } from "../../../../../../../struct/client/NiakoClient";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, menu: StringSelectMenuInteraction<'cached'>, lang: string) => {    
    const values = menu.customId.split('.')
    const align = menu.values[0]

    const doc = await client.db.modules.banner.get(interaction.guildId)
    const text = client.db.modules.banner.getText(doc, values[1], values[2])
    if(!text) {
        return menu.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка выравниваний',
                    'Я не нашла текст...'
                )
            ]
        })
    }
    
    text.align = align as any
    doc.markModified('items')
    await client.db.modules.banner.save(doc)


    return interaction.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Установка выравниваний',
                `Вы **установили** выравнивание по **x**`
            )
        ],
        components: client.storage.components.leaveBack(`setTextAlignAndBaseline.${text.textType}.${text.createdTimestamp}`, lang, true)
    })
}