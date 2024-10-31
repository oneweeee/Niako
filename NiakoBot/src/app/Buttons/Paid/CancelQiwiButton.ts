import { ButtonInteraction } from "discord.js";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseInteraction from "../../../struct/base/BaseInteraction";

export default new BaseInteraction(
    'cancelQiwiPaid',
    async (client: NiakoClient, button: ButtonInteraction<'cached'>, lang: string) => {
        const userId = button.customId.split('.')[1]

        if(button.user.id !== userId) {
            return button.reply({ content: client.lang.get('errors.qiwi.thisIsNotYourAccount', lang), ephemeral: true })
        }

        const account = await client.db.accounts.findOneOrCreate(button.user.id)
        if(account.qiwiBillId === 'No') {
            return button.reply({ content: client.lang.get('errors.qiwi.notHaveAnActiveRequest', lang), ephemeral: true })
        }

        const bill = await client.qiwi.bills.getStatus(account.qiwiBillId).catch(() => null)
        if(!bill || bill.status.value === 'PAID') {
            return button.reply({ content: client.lang.get('errors.qiwi.accountAlreadyPaid', lang), ephemeral: true })
        }

        account.qiwiBillId = 'No'
        await Promise.all([
            client.qiwi.bills.reject(bill.billId),
            account.save()
        ])

        return button.update({
            embeds: [
                client.storage.embeds.default(
                    button.member, client.lang.get('commands.premium.operation.title', lang),
                    client.lang.get('commands.premium.cancelQiwiPaid.description', lang), { color: true }
                ).setFooter({ text: client.lang.get('commands.premium.cancelQiwiPaid.footer', lang) })
            ],
            components: []
        })
    }
)