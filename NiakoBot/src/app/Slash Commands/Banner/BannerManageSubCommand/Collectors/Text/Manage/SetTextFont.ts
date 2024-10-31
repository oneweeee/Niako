import { CommandInteraction, StringSelectMenuInteraction } from "discord.js";
import { NiakoClient } from "../../../../../../../struct/client/NiakoClient";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, menu: StringSelectMenuInteraction<'cached'>, lang: string) => {    
    const values = menu.customId.split('.')
    const font = menu.values[0]

    const doc = await client.db.modules.banner.get(interaction.guildId)
    const text = client.db.modules.banner.getText(doc, values[1], values[2])
    if(!text) {
        return menu.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка шрифта',
                    'Я не нашла текст...'
                )
            ]
        })
    }
    
    text.font = font
    doc.markModified('items')
    await client.db.modules.banner.save(doc)

    const data = await client.storage.embeds.bannerTextEditFont(interaction.member, text, lang)

    return interaction.editReply({
        ...data,
        components: client.storage.components.leaveBack(`manageText.${text.textType}.${text.createdTimestamp}`, lang, true)
    })
}