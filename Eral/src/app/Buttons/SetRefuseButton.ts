import { ButtonInteraction } from "discord.js";
import BaseInteraction from "../../struct/base/BaseInteraction";
import RuslanClient from "../../struct/client/Client";

export default new BaseInteraction(
    'refuseSet',
    async (client: RuslanClient, button: ButtonInteraction<'cached'>) => {
        await button.deferReply({ ephemeral: true })

        const id = button.customId.split('.')[1]
        const userId = button.customId.split('.')[2]

        client.db.set.delete(`${userId}.${id}`)

        const target = button.guild.members.cache.get(userId)
        if(target) {
            await target.send({
                embeds: [ client.storage.embeds.default(target, 'Отклонение заявки', `Ваша **заявка** была **отклонена** администратором ${button.user.toString()}`) ]
            }).catch(() => {})
        }

        await button.message.edit({
            embeds: [
                client.storage.embeds.copy(button.message.embeds[0]!.data)
                .setFooter({ text: `Id: ${userId}・Отклонил: ${button.user.username}` })
            ], components: []
        })

        return button.editReply({
            embeds: [ client.storage.embeds.default(button.member, 'Отклонение заявки', `Вы **отклонили** заявку от <@!${userId}>`) ]
        })
    }
)