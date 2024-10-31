import { NiakoClient } from "../../../../../struct/client/NiakoClient";
import { CommandInteraction, ButtonInteraction } from "discord.js";

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

    if(!boost.boosted) {
        return button.reply({ content: client.lang.get('commands.premium.accessRemove.notBoostedBoost', lang), ephemeral: true })
    }

    await client.db.boosts.resolveFallBoostGuild(boost.guildId)
    
    const guild = await client.util.getGuild(boost.guildId)

    boost.boosted = false
    boost.boostedTimestamp = 0
    boost.guildId = '0'

    await boost.save()

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.lang.get('commands.premium.accessRemove.title', lang),
                client.lang.get('commands.premium.accessRemove.description', lang, { name: guild ? guild.name : 'unknown' }),
                { color: true }
            )
        ],
        components: client.storage.components.leave('manage', lang)
    })
}