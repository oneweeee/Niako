import { StringSelectMenuInteraction, ThreadChannel } from "discord.js";
import BaseInteraction from "../../../struct/base/BaseInteraction";
import { NiakoClient } from "../../../struct/client/NiakoClient";

export default new BaseInteraction(
    'selectKickMemberGroup',
    async (client: NiakoClient, menu: StringSelectMenuInteraction<'cached'>, lang: string) => {
        const userId = menu.values[0]

        const doc = await client.db.modules.group.get(menu.guildId)
        if(!doc.state) {
            return menu.update({ content: 'Модуль **групп** выключен на сервере', components: [] })
        }

        const group = await client.db.groups.getChannel(menu.channel!.id)
        if(!group) {
            return menu.update({
                embeds: [
                    client.storage.embeds.default(
                        menu.member, 'Выгнать пользователя с группы',
                        `Я **не** нашла **группу**`
                    )
                    .setColor(doc.color)
                ],
                components: []
            })
        }

        if(userId === group.userId) {
            return menu.update({
                embeds: [
                    client.storage.embeds.default(
                        menu.member, 'Выгнать пользователя с группы',
                        `Вы **не** можете выгнать себя`
                    )
                    .setColor(doc.color)
                ],
                components: []
            })
        }

        const channel = (menu.channel as ThreadChannel)
        await channel.members.remove(userId).catch(() => {})

        return menu.update({
            embeds: [
                client.storage.embeds.default(
                    menu.member, 'Выгнать пользователя с группы',
                    `Вы **выгнали** пользователя <@!${userId}>`
                )
                .setColor(doc.color)
            ],
            components: []
        })
    }
)