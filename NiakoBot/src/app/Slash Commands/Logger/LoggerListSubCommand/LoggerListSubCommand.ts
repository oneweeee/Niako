import { NiakoClient } from "../../../../struct/client/NiakoClient";
import { CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, lang: string) => {
    const doc = await client.db.modules.audit.get(interaction.guildId)
    return interaction.editReply({
        embeds: [ await client.storage.embeds.loggerList(interaction.member, doc) ]
    })
}