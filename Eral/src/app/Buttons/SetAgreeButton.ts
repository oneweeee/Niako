import { ButtonInteraction } from "discord.js";
import BaseInteraction from "../../struct/base/BaseInteraction";
import RuslanClient from "../../struct/client/Client";

export default new BaseInteraction(
    'agreeSet',
    async (client: RuslanClient, button: ButtonInteraction<'cached'>) => {
        await button.deferReply({ ephemeral: true })

        const id = button.customId.split('.')[1]
        const userId = button.customId.split('.')[2]

        client.db.set.delete(`${userId}.${id}`)

        const target = button.guild.members.cache.get(userId)
        if(target) {
            await target.send({
                embeds: [ client.storage.embeds.default(target, 'Принятие заявки', `Ваша **заявка** была **принята** администратором ${button.user.toString()}`) ]
            }).catch(() => {})

            await target.roles.add(id).catch(() => {})

            await button.message.edit({
                embeds: [
                    client.storage.embeds.copy(button.message.embeds[0]!.data)
                    .setFooter({ text: `Id: ${userId}・Принял: ${button.user.username}` })
                ], components: []
            })

            return button.editReply({
                embeds: [ client.storage.embeds.default(button.member, 'Принятие заявки', `Вы **приняли** заявку от <@!${userId}>`) ]
            })
        } else {
            return button.editReply({
                embeds: [ client.storage.embeds.default(button.member, 'Принятие заявки', `участника <@!${userId}> **нет** на сервере, Вы **можете** только отклонить`) ]
            })
        }
    }
)