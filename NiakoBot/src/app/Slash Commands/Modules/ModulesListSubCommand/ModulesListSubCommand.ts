import { NiakoClient } from "../../../../struct/client/NiakoClient";
import { CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, lang: string) => {    
    /*const doc = await client.db.guilds.get(interaction.guildId)
    return interaction.editReply({
        embeds: [ client.storage.embeds.commandsDisableList(interaction.member, doc) ]
    })*/
}