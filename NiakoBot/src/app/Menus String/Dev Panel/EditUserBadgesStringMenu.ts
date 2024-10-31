import BaseInteraction from "../../../struct/base/BaseInteraction";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import { StringSelectMenuInteraction } from "discord.js";

export default new BaseInteraction(
    'devPanelSelectBadgeUser',
    async (client: NiakoClient, menu: StringSelectMenuInteraction<'cached'>, lang: string) => {        
        const userId = menu.customId.split('.')[1]
        if(!userId) {
            return menu.reply({
                embeds: [
                    client.storage.embeds.error(
                        menu.member, 'Изменение значков пользователя',
                        `Пользователь с Id **${userId}** не найден`
                    )
                ],
                ephemeral: true
            })
        }

        const user = await client.util.getUser(userId)
        if(!user) {
            return menu.reply({
                embeds: [
                    client.storage.embeds.error(
                        menu.member, 'Изменение значков пользователя',
                        `Пользователь <@${userId}> с Id **${userId}** не найден`
                    )
                ],
                ephemeral: true
            })
        }

        const badges = await client.db.badges.filterUser(userId, true)
       
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
                    await client.db.badges.create({ userId, guildId: '0', type: 'User', badge: (badge as any) })
                }
            }
    
            if(badges.length >= newBadges.length) {
                for ( let i = 0; badges.length > i; i++ ) {
                    const badge = badges[i]
                    if(!newBadges.includes(badge.badge)) {
                        await client.db.badges.remove(userId, badge.badge, 'User')
                    }
                }
            }
        }

        return menu.update({
            embeds: [
                client.storage.embeds.default(
                    menu.member, 'Управление значками',
                    `В этой панели Вы можете управлять значками <@${userId}>`
                )
            ],
            components: await client.storage.components.editUserBadges(user.id)
        })
    }
)