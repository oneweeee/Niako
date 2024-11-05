import { CommandInteraction, StringSelectMenuInteraction, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, int: StringSelectMenuInteraction<'cached'>, locale: Locale) => {
    const res = await client.db.crashs.get(interaction.guildId)

    const find = res.groups.findIndex((g) => g.roleId === int.customId.split('.')[1])

    if(typeof find === 'undefined' || find === -1) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.change_action", locale)}`,
                    locale, `${client.services.lang.get("commands.antinuke.collectors.crash.group_name", locale)} **${int.customId.split('.')[1]}** ${client.services.lang.get("commands.antinuke.collectors.crash.no_found", locale)}`
                )
            ],
            components: [ client.storage.components.leaveCustom(locale, 'leaveEditRolesGroup') ]
        })
    }

    const actions = client.services.constants.actionCrashTypes as any[]
    const push = int.values[0] as 'Ban'
    for ( let i = 0; actions.length > i; i++ ) {
        const get = res.groups[find].actions.find((a) => a.type === actions[i])
        if(get) {
            get.push = push
        } else {
            res.groups[find].actions.push({ type: actions[i], push })
        }
    }

    res.markModified('groups')
    await client.db.crashs.save(res)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.change_action", locale)}`, locale,
                `${client.services.lang.get("commands.antinuke.collectors.crash.auto_settings", locale)} <@&${int.customId.split('.')[1]}>`
            )
        ],
        components: [ client.storage.components.leaveCustom(locale, `leaveEditRoleGroup.${int.customId.split('.')[1]}`) ]
    })
}