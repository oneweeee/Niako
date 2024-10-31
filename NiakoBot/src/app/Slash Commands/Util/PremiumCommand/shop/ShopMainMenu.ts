import { NiakoClient } from "../../../../../struct/client/NiakoClient";
import { CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, lang: string) => {
    return interaction.editReply({
        embeds: [ await client.storage.embeds.shop(interaction.member, lang) ],
        components: client.storage.components.shop(lang)
    })
}