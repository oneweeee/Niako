import { CommandInteraction, StringSelectMenuInteraction, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, menu: StringSelectMenuInteraction<'cached'>, locale: Locale) => {
    const res = await client.db.crashs.get(interaction.guildId)

    const find = res.groups.findIndex((g) => g.roleId === menu.customId.split('.')[1])

    if(typeof find === 'undefined' || find === -1) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.change_action", locale)}`,
                    locale, `${client.services.lang.get("commands.antinuke.collectors.crash.group_name", locale)} **${menu.customId.split('.')[1]}** ${client.services.lang.get("commands.antinuke.collectors.crash.no_found", locale)}`
                )
            ],
            components: [ client.storage.components.leaveCustom(locale, 'leaveEditRolesGroup') ]
        })
    }

    const action = res.groups[find].actions.findIndex((a) => a.type === menu.customId.split('.')[2])
    if(0 > action) {
        res.groups[find].actions.push({type: menu.customId.split('.')[2] as any, push: menu.values[0] as any})
    } else {
        res.groups[find].actions[action].push = menu.values[0] as any
    }

    res.markModified('groups')
    await client.db.crashs.save(res)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.change_action", locale)}`, locale,
                `${client.services.lang.get("commands.antinuke.collectors.crash.you_change", locale)} **${client.db.crashs.resolveCrashType(menu.customId.split('.')[2] as any, locale)}** ${client.services.lang.get("commands.antinuke.collectors.crash.role", locale)} <@&${menu.customId.split('.')[1]}>`
            )
        ],
        components: [ client.storage.components.leaveCustom(locale, `leaveEditRoleGroup.${menu.customId.split('.')[1]}`) ]
    })
}