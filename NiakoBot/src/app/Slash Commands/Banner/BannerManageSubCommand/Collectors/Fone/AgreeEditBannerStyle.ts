import { CommandInteraction, StringSelectMenuInteraction } from "discord.js";
import { NiakoClient } from "../../../../../../struct/client/NiakoClient";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, menu: StringSelectMenuInteraction<'cached'>, lang: string) => {
    const pack = menu.customId.split('.')[1]
    const style = menu.values[0]

    const doc = await client.db.modules.banner.get(interaction.guildId)

    let getConfig: any = {}
    switch(pack) {
        case 'LitePack':
            getConfig = client.canvas.packs.getLite(style as any)
            break
        case 'TechnologiePack':
            getConfig = client.canvas.packs.getTechnologie(style as any)
            break
        case 'AvenuePack':
            getConfig = client.canvas.packs.getAvenue(style as any)
            break
        case 'SpacePack':
            getConfig = client.canvas.packs.getSpace(style as any)
            break
        default:
            return menu.reply({ embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Выбор стиля',
                    `Я не нашла пак **${pack}**...`
                )
            ],
            ephemeral: true
        })
    }

    if(!getConfig) return menu.reply({ embeds: [
        client.storage.embeds.error(
            interaction.member, 'Выбор стиля',
            `Я не нашла стиль **${style}**...`
        )
    ],
    ephemeral: true
})

    doc.activeUserUpdated = getConfig.activeUserUpdated
    doc.background = getConfig.background
    if(doc.activeUserStatus === doc.status) {
        doc.activeUserStatus = getConfig.status
    }
    doc.status = getConfig.status
    doc.backgrounds = getConfig.backgrounds
    
    if(doc.type === 'Normal') {
        doc.items = getConfig.items
    } else {
        doc.items = client.db.modules.banner.resolveItems(getConfig.items, true)
    }
    
    doc.markModified('backgrounds')
    await client.db.modules.banner.save(doc)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, 'Установка фона',
                `Вы **установили** конфигурацию **${pack.split('Pack')[0]}** стиля **${style}**`
            )
        ],
        components: client.storage.components.leaveBack('manage', lang, true)
    })
}