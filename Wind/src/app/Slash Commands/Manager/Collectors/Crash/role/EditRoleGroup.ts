import { CommandInteraction, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, value: string, locale: Locale) => {
    const res = await client.db.crashs.get(interaction.guildId)
    
    const get = res.groups.find((g) => g.roleId === value)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.change_group", locale)}`,
                locale, `${client.services.lang.get("commands.antinuke.collectors.crash.edit_group", locale)} <@&${value}>`
            ).addFields(
                client.services.constants.actionCrashTypes.map((str) => {
                    let value: string

                    if(get && get.actions.find((a) => a.type === str)) {
                        value = get.actions.find((a) => a.type === str)!.push
                    } else {
                        value = 'None'
                    }

                    return {
                        name: client.db.crashs.resolveCrashType(str as any, locale), inline: true, value: client.util.resolvePushType(value as any, locale)
                    }
                })
            )
        ],
        components: client.storage.components.editGroupMenu(value, Boolean(get?.disabled), value === interaction.guildId, locale)
    })
}