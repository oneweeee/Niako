import { CommandInteraction, Role, RoleSelectMenuInteraction, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, menu: RoleSelectMenuInteraction<'cached'>, locale: Locale) => {
    const get = await client.db.crashs.get(interaction.guildId)

    const role = menu.roles.first()

    if(!role) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.ban_role", locale)}`,
                    locale, `${client.services.lang.get("commands.antinuke.collectors.crash.incorrect_role", locale)}`
                )
            ],
            components: [ client.storage.components.leaveCustom(locale, 'leaveCrashSystem', false) ]
        })
    }

    const old = get.banId

    get.banId = role.id
    await client.db.crashs.save(get)

    await client.managers.audit.send(
        get.channelId, {
            action: 'AntiCrashRoleEdit',
            system: 'Crash',
            locale: locale,
            member: interaction.member,
            oldRole: interaction.guild.channels.cache.get(old) as Role | undefined,
            newRole: role
        }
    )

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.ban_role", locale)}`,
                locale, `${client.services.lang.get("commands.antinuke.collectors.crash.set_role", locale)} ${role.toString()} ${client.services.lang.get("commands.antinuke.collectors.crash.as", locale)}`
            )
        ],
        components: [ client.storage.components.leaveCustom(locale, 'leaveCrashSystem') ]
    })
}