import { CommandInteraction, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, locale: Locale) => {
    const res = await client.db.crashs.get(interaction.guildId)
    
    return interaction.editReply({
        embeds: [
            client.storage.embeds.groupAction(interaction, client.db.guilds.getColor(interaction.guildId), res, 'Role', locale)
        ],
        components: client.storage.components.roleGroupEdit(interaction.guild, res, interaction.locale)
    })
}