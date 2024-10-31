import { CommandInteraction, StringSelectMenuInteraction } from "discord.js";
import { NiakoClient } from "../../../../../../struct/client/NiakoClient";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, menu: StringSelectMenuInteraction<'cached'>, lang: string) => {    
    const doc = await client.db.modules.banner.get(interaction.guildId)
    if(doc.background.endsWith('.gif')) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Изменить качество',
                    `Вы **не** можете изменить **качесвто**, пока установлен **анимированый** фон`
                )
            ],
            components: client.storage.components.leaveBack('manage', lang, false)    
        })
    }

    const normal = menu.values[0] === 'Normal'
    doc.items = client.db.modules.banner.resolveItems(doc.items, !normal)
    doc.type = normal ? 'Normal' : 'Compressed'

    doc.markModified('items')
    await client.db.modules.banner.save(doc)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Изменить качество',
                `Вы изменили **качество** баннера на **${normal ? 'обычное' : 'сжатое'}**`
            )
        ],
        components: client.storage.components.leaveBack('manage', lang, true)
    })
}