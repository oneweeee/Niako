import { NiakoClient } from "../../../../../struct/client/NiakoClient";
import { ButtonInteraction, CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, button: ButtonInteraction<'cached'>, lang: string) => {
    const transactions = (
        await client.db.accounts.findOneOrCreate(interaction.member.id)
    ).transactions.sort((a, b) => b.date - a.date)

    const page = Number(button.message.embeds[0].footer!.text.split(' ')[1].split('/')[0])-2
    
    return interaction.editReply({
        embeds: [ client.storage.embeds.transaction(interaction.member, transactions, lang) ],
        components: client.storage.components.paginator(transactions, lang, page, 10, true, false, true, 'shop')
    })
}