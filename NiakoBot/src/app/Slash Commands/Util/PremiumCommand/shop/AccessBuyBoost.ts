import { NiakoClient } from "../../../../../struct/client/NiakoClient";
import { CommandInteraction, ButtonInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, button: ButtonInteraction<'cached'>, lang: string) => {
    const count = Number(button.customId.split('.')[1])
    const account = await client.db.accounts.findOneOrCreate(interaction.member.id)

    const cost = client.util.resolveBoostCost(count)
    
    if(cost > account.balance) {
        return button.reply({ content: client.lang.get('errors.dontHaveEnoughRuble', lang), ephemeral: true })
    }
    
    account.balance -= cost
    account.transactions.push(
        {
            date: Date.now(),
            type: 'BuyingBoosts',
            options: { boosts: count },
            count: cost,
            state: false
        }
    )

    await account.save()
    .then(async () => {
        await interaction.editReply({
            embeds: [
                client.storage.embeds.color(true)
                .setDescription(client.lang.get('system.loading', lang))
            ],
            components: []
        })

        await button.deferUpdate()

        await client.db.boosts.createMultiple(interaction.member.id, count)

        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.lang.get('commands.premium.bought.title', lang),
                    client.lang.get('commands.premium.accessBought.description', lang, { cost, count }),
                    { color: true}
                )
                .setFooter({ text: client.lang.get('commands.premium.accessBought.footer', lang) })
            ],
            components: client.storage.components.leave('shop', lang)
        })
    })
    .catch((err) => {
        client.logger.error(err, 'BUYING STAR ERROR')
        return interaction.editReply({
            embeds: [ 
                client.storage.embeds.default(
                    interaction.member, client.lang.get('system.error', lang),
                    client.lang.get('errors.saveError', lang),
                    { color: true}
                )
            ],
            components: client.storage.components.leave('shop', lang)
        })
    })
}