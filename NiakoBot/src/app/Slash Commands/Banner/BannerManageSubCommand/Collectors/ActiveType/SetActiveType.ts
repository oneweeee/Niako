import { CommandInteraction, StringSelectMenuInteraction } from "discord.js";
import { NiakoClient } from "../../../../../../struct/client/NiakoClient";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, menu: StringSelectMenuInteraction<'cached'>, lang: string) => {    
    const doc = await client.db.modules.banner.get(interaction.guildId)

    const online = menu.values[0] === 'Online'
    doc.activeType = online ? 'Online' : 'Message'

    doc.markModified('items')
    await client.db.modules.banner.save(doc)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Изменить тип активности',
                `Вы изменили **тип** активного участника на **${online ? 'голосовую' : 'текстовую'}** активность`
            )
        ],
        components: client.storage.components.leaveBack('manage', lang, true)
    })
}