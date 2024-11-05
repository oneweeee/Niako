import {
    CommandInteraction,
    ChannelSelectMenuInteraction,
    ChannelType,
    GuildChannel,
    Locale
} from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, menu: ChannelSelectMenuInteraction<'cached'>, locale: Locale) => {
    const get = await client.db.crashs.get(interaction.guildId)

    const channel = menu.channels.first()

    if(!channel || channel.type !== ChannelType.GuildText) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.notification", locale)}`,
                    locale, `${client.services.lang.get("commands.antinuke.collectors.crash.incorrect_channel", locale)}`
                )
            ],
            components: [ client.storage.components.leaveCustom(locale, 'leaveCrashSystem', false) ]
        })
    }

    const old = get.channelId

    get.channelId = channel.id
    await client.db.crashs.save(get)

    await client.managers.audit.send(
        get.channelId, {
            action: 'AntiCrashChannelLogEdit',
            system: 'Crash',
            locale: locale,
            member: interaction.member,
            oldChannel: interaction.guild.channels.cache.get(old) as GuildChannel | undefined,
            newChannel: channel
        }
    )

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.notification", locale)}`,
                locale, `${client.services.lang.get("commands.antinuke.collectors.crash.set_channel", locale)} ${channel.toString()} ${client.services.lang.get("commands.antinuke.collectors.crash.as_log", locale)}`
            )
        ],
        components: [ client.storage.components.leaveCustom(locale, 'leaveCrashSystem') ]
    })
}