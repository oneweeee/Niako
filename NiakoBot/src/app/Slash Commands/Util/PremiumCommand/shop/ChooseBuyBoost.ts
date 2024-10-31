import { CommandInteraction, ModalSubmitInteraction } from "discord.js";
import { NiakoClient } from "../../../../../struct/client/NiakoClient";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, int: ModalSubmitInteraction<'cached'>, lang: string) => {
    const count = parseInt(int.fields.getTextInputValue('count'))
    const account = await client.db.accounts.findOneOrCreate(interaction.member.id)

    if(isNaN(count)) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.lang.get('commands.premium.bought.title', lang),
                    client.lang.get('errors.numberIsNaN', lang),
                    { color: true }
                )
            ],
            components: client.storage.components.leave('shop', lang)
        })
    }

    if(0 >= count) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.lang.get('commands.premium.bought.title', lang),
                    client.lang.get('errors.zeroIsGreaterThanNumber', lang),
                    { color: true }
                )
            ],
            components: client.storage.components.leave('shop', lang)
        })
    }

    const cost = client.util.resolveBoostCost(count)

    return interaction.editReply({
        embeds: [ client.storage.embeds.buy(interaction.member, count, cost, account.balance >= cost, lang) ],
        components: client.storage.components.buy(count, cost, account.balance >= cost, lang)
    })
}