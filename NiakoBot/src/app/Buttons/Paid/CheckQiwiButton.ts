import { ButtonInteraction } from "discord.js";
import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseInteraction from "../../../struct/base/BaseInteraction";

export default new BaseInteraction(
    'checkQiwiPaid',
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
        if(!bill) {
            return button.reply({ content: `Попробуйте чуть позже...`, ephemeral: true })
        }
        if(bill.status.value === 'PAID') {
            account.transactions.push({
                date: Date.now(),
                state: true,
                type: 'ReplenishmentBalance',
                count: Number(bill.amount.value),
            })
            account.balance += Number(bill.amount.value)
            account.qiwiBillId = 'No'
            await account.save()
            
            return button.update({
                embeds: [
                    client.storage.embeds.default(
                        button.member, client.lang.get('commands.premium.operation.title', lang),
                        client.lang.get('commands.premium.checkQiwiPaid.description', lang, { count: Number(bill.amount.value) }), { color: true }
                    )
                ],
                components: []
            })
        } else {
            let content = button.message.embeds[0].description!

            const countUses = content.split('\n\n')[1] ? content.split('\n\n')[1].split('\n').length : 0

            if(countUses >= 10) {
                const account = await client.db.accounts.findOneOrCreate(button.user.id)
                account.qiwiBillId = 'No'
                await account.save()
                
                return button.update({
                    embeds: [
                        client.storage.embeds.default(
                            button.member, client.lang.get('errors.qiwi.maximumNumberOfRequests.title', lang),
                            client.lang.get('errors.qiwi.maximumNumberOfRequests.description', lang), { color: true }
                        )
                    ],
                    components: []
                })
            }

            if(countUses === 0) {
                content += '\n\n'
            } else {
                content += '\n'
            }

            content += `**[<t:${Math.round(Date.now()/1000)}>]** ${client.lang.get(`errors.qiwi.status.${bill.status.value.toLowerCase()}`, lang)}`
        
            return button.update({
                embeds: [
                    client.storage.embeds.copy(button.message.embeds[0].data!)
                    .setDescription(content)
                ]
            })
        }
    }
)