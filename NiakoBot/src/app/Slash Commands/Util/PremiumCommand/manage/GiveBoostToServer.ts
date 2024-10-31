import { ButtonInteraction, CommandInteraction, ModalSubmitInteraction } from "discord.js";
import { NiakoClient } from "../../../../../struct/client/NiakoClient";
import ms from "ms";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, guildId: string, int: ButtonInteraction<'cached'> | ModalSubmitInteraction<'cached'>, lang: string) => {
    const guild = await client.util.getGuild(guildId)
    if(!guild) {
        return int.reply({ content: client.lang.get('errors.unknownGuildId', lang, { id: guildId }), ephemeral: true })
    }
    
    const boosts = await client.db.boosts.filter({ userId: interaction.member.id })

    let boost

    const noBoosted = boosts.filter((b) => !b.boosted && b.actived)
    if(noBoosted.length === 0) {
        const noActived = boosts.filter((b) => !b.actived)
        if(noActived.length === 0) {
            return int.reply({ content: client.lang.get('errors.boost.noFree', lang), ephemeral: true })
        } else {
            boost = noActived[0]
        }
    } else {
        boost = noBoosted[0]
    }

    if(!boost.actived) {
        boost.actived = true
        boost.activedTimestamp = Date.now()
        boost.end = Math.round(Date.now() + ms('30d'))
    }

    client.db.boosts.addBoostGuild(guildId)

    boost.guildId = guildId
    boost.boosted = true
    boost.boostedTimestamp = Date.now()
    
    await boost.save()

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member,
                client.lang.get('commands.premium.accessGive.title', lang),
                client.lang.get('commands.premium.accessGive.description', lang, { name: guild.name }),
                { color: true }
            )
        ],
        components: client.storage.components.leave('giveBoost', lang)
    })
}