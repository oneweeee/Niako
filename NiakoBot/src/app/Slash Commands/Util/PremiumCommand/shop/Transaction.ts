import { NiakoClient } from "../../../../../struct/client/NiakoClient";
import { CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, lang: string) => {
    const transactions = (
        await client.db.accounts.findOneOrCreate(interaction.member.id)
    ).transactions.sort((a, b) => b.date - a.date)

    return interaction.editReply({
        embeds: [ client.storage.embeds.transaction(interaction.member, transactions, lang) ],
        components: client.storage.components.paginator(transactions, lang, 0, 10, true, false, true, 'shop')
    })
}