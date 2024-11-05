import { ButtonInteraction, CommandInteraction, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, button: ButtonInteraction<'cached'>, locale: Locale) => {
    const res = await client.db.crashs.get(interaction.guildId)
    const page = Number(button.message.embeds[0].footer!.text.split(': ')[1].split('/')[1])-1
    return interaction.editReply({
        embeds: [ client.storage.embeds.whitelist(interaction, client.db.guilds.getColor(interaction.guildId), res.whiteList, locale, page) ],
        components: client.storage.components.chooseWhitelistAction(res.whiteList, locale, page)
    })
}