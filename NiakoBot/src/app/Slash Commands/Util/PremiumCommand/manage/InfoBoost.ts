import { CommandInteraction, StringSelectMenuInteraction } from "discord.js";
import { NiakoClient } from "../../../../../struct/client/NiakoClient";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, menu: StringSelectMenuInteraction<'cached'>, lang: string) => {
    const boosts = await client.db.boosts.filter({ userId: interaction.member.id })
    const value = menu.values[0]

    const boost = boosts.find((b) => String(b._id) === value)

    if(!boost) {
        return menu.reply({ content: client.lang.get('system.unknownBoost', lang), ephemeral: true })
    }

    return interaction.editReply({
        embeds: [ await client.storage.embeds.manageBoostInfo(interaction.member, boost, lang) ],
        components: client.storage.components.extendBoost(value, boost.actived, boost.boosted, lang)
    })
}