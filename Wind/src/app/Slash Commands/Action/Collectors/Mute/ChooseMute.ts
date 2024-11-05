import {
    GuildMember,
    CommandInteraction,
    ButtonInteraction,
    Locale
} from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, target: GuildMember, button: ButtonInteraction<'cached'>, locale: Locale) => {
    const doc = await client.db.guilds.get(interaction.guildId, locale)
    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `Взаимодействия с участником`,
                locale, `Выберите, какой **мут** использовать на ${target.toString()}?`,
                { indicateTitle: true, target }
            )
        ],
        components: client.storage.components.chooseMute(doc, locale)
    })
}