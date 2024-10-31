import BaseInteraction from "../../../struct/base/BaseInteraction";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import { ModalSubmitInteraction } from "discord.js";

export default new BaseInteraction(
    'devPanelModalWindow.AddBalance',
    async (client: NiakoClient, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
        await modal.deferReply({ ephemeral: true })

        const userId = modal.fields.getTextInputValue('userId')
        const count = modal.fields.getTextInputValue('count')

        if(client.util.isNumber(count, { minChecked: 1, maxChecked: 999999})) {
            return modal.editReply({
                embeds: [
                    client.storage.embeds.error(
                        modal.member, 'Выдача денег',
                        `Указанный аргумент **${count}** не является числом или имеет отрицательное значение`
                    )
                ]
            })
        }

        const doc = await client.db.accounts.findOneOrCreate(userId)
        doc.balance += Number(count)
        doc.transactions.push(
            {
                date: Date.now(), count: Number(count),
                type: 'DevPanelAddBalance', state: true,
                options: { userId: modal.user.id }
            }
        )
        await doc.save()

        return modal.editReply({
            embeds: [
                client.storage.embeds.success(
                    modal.member, 'Выдача денег',
                    `Вы **выдали** пользователю <@${userId}> **${count}** ${client.config.emojis.premium.ruble}`, true
                )
                .setFooter({ text: `・Баланс пользователя составляет ${doc.balance} рублей` })
            ]
        })
    }
)