import { CommandInteraction, StringSelectMenuInteraction } from "discord.js";
import { NiakoClient } from "../../../../../../../struct/client/NiakoClient";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, menu: StringSelectMenuInteraction<'cached'>, lang: string) => {    
    const values = menu.customId.split('.')
    const timzone = menu.values[0]

    const doc = await client.db.modules.banner.get(interaction.guildId)
    const text = client.db.modules.banner.getText(doc, values[1], values[2])
    if(!text) {
        return menu.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Установка таймзоны',
                    'Я не нашла текст...'
                )
            ]
        })
    }
    
    text.timezone = timzone
    doc.markModified('items')
    await client.db.modules.banner.save(doc)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Установка таймзоны',
                `Вы установили таймзону **${timzone.split('-')[0]}+${timzone.split('-')[1]}**`
            )
        ],
        components: client.storage.components.leaveBack(`manageText.${text.textType}.${text.createdTimestamp}`, lang, true)
    })
}