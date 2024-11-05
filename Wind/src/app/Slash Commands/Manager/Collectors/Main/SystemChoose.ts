import { CommandInteraction, StringSelectMenuInteraction, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, menu: StringSelectMenuInteraction<'cached'>, locale: Locale) => {
    if(menu.values[0] === 'anti-raid') {
        const raid = await client.db.raids.get(interaction.guildId)
        return interaction.editReply({
            embeds: [
                client.storage.embeds.antiraidMainMenu(interaction, client.db.guilds.getColor(interaction.guildId), raid, locale)
            ],
            components: client.storage.components.antiraidSetting(raid, locale)
        })
    } else {
        const crash = await client.db.crashs.get(interaction.guildId)
        return interaction.editReply({
            embeds: [
                await client.storage.embeds.anticrashMainMenu(interaction, client.db.guilds.getColor(interaction.guildId), crash, locale)
            ],
            components: client.storage.components.anticrashSetting(crash, locale)
        })
    }
}