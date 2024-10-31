import { NiakoClient } from "../../../../../struct/client/NiakoClient";
import { CommandInteraction, ButtonInteraction } from "discord.js";
import ms from "ms";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, button: ButtonInteraction<'cached'>, lang: string) => {
    const account = await client.db.accounts.findOneOrCreate(interaction.member.id)
    const cost = client.util.resolveBoostCost(1)

    if(cost > account.balance) {
        return button.reply({ content: client.lang.get('errors.dontHaveEnoughRuble', lang), ephemeral: true })
    }

    const boosts = await client.db.boosts.filter({ userId: interaction.member.id })
    const value = button.customId.split('.')[1]

    const boost = boosts.find((b) => String(b._id) === value)

    if(!boost) {
        return button.reply({ content: client.lang.get('system.unknownBoost', lang), ephemeral: true })
    }

    account.transactions.push(
        {
            date: Date.now(),
            type: 'ProlongBoost',
            count: cost,
            state: false
        }
    )
    account.balance -= cost
    boost.end += ms('30d')
    await boost.save()
    await account.save()

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.lang.get('commands.premium.prolongBoost.title', lang),
                client.lang.get('commands.premium.prolongBoost.description', lang),
                { color: true }
            )
        ],
        components: client.storage.components.leave('manage', lang)
    })
}