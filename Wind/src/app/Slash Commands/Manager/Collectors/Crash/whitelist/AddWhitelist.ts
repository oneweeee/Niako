import { CommandInteraction, UserSelectMenuInteraction, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, menu: UserSelectMenuInteraction<'cached'>, locale: Locale) => {
    const res = await client.db.crashs.get(interaction.guildId)

    const user = menu.users.first()
    if(!user || (user && !interaction.guild.members.cache.has(user.id))) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.add_whitelist", locale)}`,
                    locale, `${client.services.lang.get("commands.antinuke.collectors.crash.incorrect_user", locale)}`
                )
            ],
            components: [ client.storage.components.leaveCustom(locale, 'leaveWhitelist') ]
        })
    }

    if(res.whiteList.includes(user.id)) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.add_whitelist", locale)}`,
                    locale, `${client.services.lang.get("commands.antinuke.collectors.crash.yes_whitelist_user", locale)}`
                )
            ],
            components: [ client.storage.components.leaveCustom(locale, 'leaveWhitelist') ]
        })
    }

    res.whiteList.push(user.id)
    await client.db.crashs.save(res)

    await client.managers.audit.send(
        res.channelId, {
            action: 'AntiCrashWhitelistAdd',
            system: 'Crash',
            locale: interaction.guildLocale,
            member: interaction.member,
            add: interaction.guild.members.cache.get(user.id)
        }
    )

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.add_whitelist", locale)}`,
                locale, `${client.services.lang.get("commands.antinuke.collectors.crash.you_add", locale)} ${user.toString()} ${client.services.lang.get("commands.antinuke.collectors.crash.whitelist_add_user", locale)}`
            )
        ],
        components: [ client.storage.components.leaveCustom(locale, 'leaveWhitelist') ]
    })
}