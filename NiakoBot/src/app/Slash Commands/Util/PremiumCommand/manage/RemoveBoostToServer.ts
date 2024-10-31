import { ButtonInteraction, CommandInteraction, ModalSubmitInteraction } from "discord.js";
import { NiakoClient } from "../../../../../struct/client/NiakoClient";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, guildId: string, int: ButtonInteraction<'cached'> | ModalSubmitInteraction<'cached'>, lang: string) => {
    const guild = await client.util.getGuild(guildId)
    if(!guild) {
        return int.reply({ content: client.lang.get('errors.unknownGuildId', lang, { id: guildId }), ephemeral: true })
    }

    const boosts = await client.db.boosts.filter({ userId: interaction.member.id })

    const boost = boosts.sort((a, b) => b.boostedTimestamp - a.boostedTimestamp).find((b) => b.guildId === guild.id)
    if(!boost) {
        return int.reply({ content: client.lang.get('errors.boost.noFreeWithGuild', lang, { name: guild.name }), ephemeral: true })
    }

    await client.db.boosts.resolveFallBoostGuild(guildId)
    
    boost.boosted = false
    boost.boostedTimestamp = 0
    boost.guildId = '0'

    await boost.save()

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.lang.get('commands.premium.accessRemove.title', lang),
                client.lang.get('commands.premium.accessRemove.description', lang, { name: guild.name }),
                { color: true }
            )
        ],
        components: client.storage.components.leave('removeBoost', lang)
    })
}