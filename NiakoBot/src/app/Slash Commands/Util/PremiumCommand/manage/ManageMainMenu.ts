import { NiakoClient } from "../../../../../struct/client/NiakoClient";
import { CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, lang: string) => {
    const boosts = await client.db.boosts.filter({ userId: interaction.member.id })
    return interaction.editReply({
        embeds: [ await client.storage.embeds.manage(interaction.member, boosts, lang) ],
        components: await client.storage.components.manageBoost(boosts, lang)
    })
}