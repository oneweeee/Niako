import { CommandInteraction, ModalSubmitInteraction } from "discord.js";
import { NiakoClient } from "../../../../../struct/client/NiakoClient";

export default (client: NiakoClient, interaction: CommandInteraction<'cached'>, int: ModalSubmitInteraction<'cached'>, lang: string) => {
    const count = parseInt(int.fields.getTextInputValue('count'))

    if(isNaN(count)) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.lang.get('commands.premium.operation.title', lang),
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
                    interaction.member, client.lang.get('commands.premium.operation.title', lang),
                    client.lang.get('errors.zeroIsGreaterThanNumber', lang),
                    { color: true }
                )
            ],
            components: client.storage.components.leave('shop', lang)
        })
    } 

    if(client.config.meta.minDepositAmount > count) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.lang.get('commands.premium.operation.title', lang),
                    client.lang.get('errors.depositIsGreaterThanCount', lang),
                    { color: true }
                )
            ],
            components: client.storage.components.leave('shop', lang)
        })
    }

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.lang.get('commands.premium.operation.title', lang),
                client.lang.get('commands.premium.operation.description', lang, { count, author: interaction.member }),
                { color: true }
            )
        ],
        components: client.storage.components.operation(count, lang)
    })
}