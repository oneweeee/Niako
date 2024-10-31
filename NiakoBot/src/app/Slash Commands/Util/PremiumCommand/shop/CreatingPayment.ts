import { NiakoClient } from "../../../../../struct/client/NiakoClient";
import { P2p } from "qiwi-sdk";
import {
    InteractionCollector,
    CommandInteraction,
    StringSelectMenuInteraction,
    CollectedInteraction,
    CacheType
} from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, int: StringSelectMenuInteraction<'cached'>, lang: string, collector: InteractionCollector<CollectedInteraction<CacheType>>) => {
    const service = int.values[0].split('.')[0]
    const count = Number(int.values[0].split('.')[1])

    const account = await client.db.accounts.findOneOrCreate(interaction.member.id)

    switch(service) {
        case 'qiwi':
            if(account.qiwiBillId !== 'No') {
                return interaction.editReply({
                    embeds: [
                        client.storage.embeds.default(
                            interaction.member, client.lang.get('commands.premium.operation.title', lang),
                            client.lang.get('errors.qiwi.billIdNotEqualToNo', lang), { color: true }
                        )
                    ],
                    components: client.storage.components.leave('shop', lang)
                })
            }
            
            client.qiwi.bills.create(
                {
                    amount: {
                        value: count,
                        currency: P2p.Currency.RUB
                    },
                    successUrl: 'https://niako.xyz/payment/success'
                }
            ).then(async (data) => {
                collector.stop()
                
                account.qiwiBillId = data.billId
                await account.save()

                return interaction.editReply({
                    embeds: [
                        client.storage.embeds.default(
                            interaction.member, client.lang.get('commands.premium.operation.title', lang),
                            client.lang.get('commands.premium.createPayment.qiwi.description', lang),
                            { color: true }
                        )
                        .setFooter({ text: client.lang.get('commands.premium.createPayment.footer', lang) })
                    ],
                    components: client.storage.components.payQiwi(data.payUrl, int.user.id, lang)
                })
            }).catch((err) => {
                client.logger.error(err, 'QIWI-SDK')

                return interaction.editReply({
                    embeds: [
                        client.storage.embeds.default(
                            interaction.member, client.lang.get('commands.premium.operation.title', lang),
                            client.lang.get('system.qiwiNotAvailable', lang),
                            { color: true }
                        )
                    ],
                    components: client.storage.components.leave('shop', lang)
                })
            })
            break
    }
}