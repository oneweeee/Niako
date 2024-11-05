import { CommandInteraction, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, locale: Locale) => {
    const get = await client.db.crashs.get(interaction.guildId)

    get.status = false
    client.db.crashs.save(get)

    await client.managers.audit.send(
        get.channelId, {
            action: 'AntiCrashOff',
            system: 'Crash',
            locale: locale,
            member: interaction.member,
            reason: client.services.lang.get("commands.antinuke.collectors.crash.off", locale)
        }
    )

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.system", locale)}`,
                locale, `${client.services.lang.get("commands.antinuke.collectors.crash.disabled", locale)}`
            )
        ],
        components: [ client.storage.components.leaveCustom(locale, 'leaveCrashSystem') ]
    })
}