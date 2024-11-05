import { CommandInteraction, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, locale: Locale) => {
    const get = await client.db.crashs.get(interaction.guildId)

    await client.managers.audit.send(
        get.channelId, {
            action: 'AntiCrashChannelLogReset',
            system: 'Crash',
            locale: locale,
            member: interaction.member,
            reason: `${client.services.lang.get("commands.antinuke.collectors.crash.reset_channel", locale)}`
        }
    )

    get.channelId = '0'
    await client.db.crashs.save(get)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.notification", locale)}`,
                locale, `${client.services.lang.get("commands.antinuke.collectors.crash.reset_notification", locale)}`
            )
        ],
        components: [ client.storage.components.leaveCustom(locale, 'leaveCrashSystem') ]
    })
}