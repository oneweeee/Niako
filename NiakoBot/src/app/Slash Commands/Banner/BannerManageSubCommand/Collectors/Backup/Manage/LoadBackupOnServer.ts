import { NiakoClient } from "../../../../../../../struct/client/NiakoClient";
import { ButtonInteraction, CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, button: ButtonInteraction<'cached'>, lang: string) => {
    const doc = await client.db.modules.banner.get(interaction.guildId)
    
    const guildLevel = client.db.boosts.getGuildLevelById(interaction.guildId)
    const backup = await client.db.backups.get(button.customId.split('.')[1])

    if(!backup) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Загрузка бэкапа',
                    `Я не нашла **данные** об **этом** бэкапе...`
                )
            ],
            components: client.storage.components.leave('backups', lang),
            files: []
        })
    }

    if(backup.bannerType === 'Normal' && guildLevel >= 2) {
        doc.type = backup.bannerType
        doc.items = backup.items
    } else {
        if(doc.type === 'Normal') {
            doc.items = client.db.modules.banner.resolveItems(backup.items)
        } else {
            doc.items = backup.items
        }
        
        doc.type = 'Compressed'
    }

    doc.background = backup.background
    doc.activeUserUpdated = backup.activeUserUpdated
    doc.updated = (backup.updated === '2m' && guildLevel >= 3 ? 'Normal' : backup.updated === '3m' && guildLevel >= 2 ? '3m' : backup.updated === '5m' && guildLevel >= 1 ? '5m' : '10m')
    await client.db.modules.banner.save(doc)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Загрузка бэкапа',
                `Вы **загрузили** бэкап **${backup.name}** на этот сервер`
            )
        ],
        components: client.storage.components.leaveBack('manage', lang),
        files: []
    })
}