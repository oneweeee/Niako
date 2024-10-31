import BaseInteraction from "../../../struct/base/BaseInteraction";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import { StringSelectMenuInteraction } from "discord.js";

export default new BaseInteraction(
    'devPanelSelectBadgeGuild',
    async (client: NiakoClient, menu: StringSelectMenuInteraction<'cached'>, lang: string) => {        
        const guildId = menu.customId.split('.')[1]

        const guild = await client.util.getGuild(guildId)
        if(!guild) {
            return menu.reply({
                embeds: [
                    client.storage.embeds.error(
                        menu.member, 'Изменение значков сервера',
                        `Сервер с Id **${guildId}** не найден`
                    )
                ],
                ephemeral: true
            })
        }

        const badges = await client.db.badges.filterGuild(guildId, true)
       
        if(menu.values.includes('clear')) {
            for ( let i = 0; badges.length > i; i++ ) {
                await badges[i].remove()
            }
        } else {
            const oldBadgesNames = badges.map((b) => b.badge)
            const newBadges = menu.values

            for ( let i = 0; newBadges.length > i; i++ ) {
                const badge = newBadges[i]
                if(!oldBadgesNames.includes(badge as any)) {
                    if(badge === 'NiakoPartner') client.db.badges.partners.add(guildId)
                    await client.db.badges.create({ guildId, userId: '0', type: 'Guild', badge: (badge as any) })
                }
            }
    
            if(badges.length >= newBadges.length) {
                for ( let i = 0; badges.length > i; i++ ) {
                    const badge = badges[i]
                    if(!newBadges.includes(badge.badge)) {
                        if(badge.badge === 'NiakoPartner' && client.db.badges.partners.has(guildId)) {
                            client.db.badges.partners.delete(guildId)
                        }
                        await client.db.badges.remove(guildId, badge.badge, 'Guild')
                    }
                }
            }
        }

        if(client.managers.ws?.ws) {
            client.managers.ws.ws.send(JSON.stringify({ method: 'updateGuildBadges', guildId }))
        }

        return menu.update({
            embeds: [
                client.storage.embeds.default(
                    menu.member, 'Управление значками',
                    `В этой панели Вы можете управлять значками **${guild.name}**`
                )
            ],
            components: await client.storage.components.editGuildBadges(guildId)
        })
    }
)