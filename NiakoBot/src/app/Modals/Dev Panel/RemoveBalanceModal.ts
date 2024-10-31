import BaseInteraction from "../../../struct/base/BaseInteraction";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import { ModalSubmitInteraction } from "discord.js";

export default new BaseInteraction(
    'devPanelModalWindow.RemoveBalance',
    async (client: NiakoClient, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
        await modal.deferReply({ ephemeral: true })

        const userId = modal.fields.getTextInputValue('userId')
        const count = modal.fields.getTextInputValue('count')

        const doc = await client.db.accounts.findOneOrCreate(userId)
        
        if(client.util.isNumber(count, { minChecked: 1, maxChecked: doc.balance })) {
            return modal.editReply({
                embeds: [
                    client.storage.embeds.error(
                        modal.member, 'Удаление денег',
                        `Указанное число **${count}** слишком **большое** или оно **отрицательного** значения`
                    )
                    .setFooter({ text: `・Баланс пользователя составляет ${doc.balance} рублей` })
                ]
            })
        }
        
        doc.balance -= Number(count)
        doc.transactions.push(
            {
                date: Date.now(), count: Number(count),
                type: 'DevPanelRemoveBalance', state: false,
                options: { userId: modal.user.id }
            }
        )
        await doc.save()

        return modal.editReply({
            embeds: [
                client.storage.embeds.success(
                    modal.member, 'Удаление денег',
                    `Вы **убрали** у пользователя <@${userId}> **${count}** ${client.config.emojis.premium.ruble}`, true
                )
                .setFooter({ text: `・Баланс пользователя составляет ${doc.balance} рублей` })
            ]
        })
    }
)