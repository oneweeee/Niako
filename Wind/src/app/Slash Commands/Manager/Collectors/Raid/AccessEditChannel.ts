import {
    CommandInteraction,
    ChannelSelectMenuInteraction,
    ChannelType,
    GuildChannel,
    Locale
} from "discord.js"
import WindClient from "#client"


export default async (client: WindClient, interaction: CommandInteraction<'cached'>, menu: ChannelSelectMenuInteraction<'cached'>, locale: Locale) => {
    const get = await client.db.raids.get(interaction.guildId)

    const channel = menu.channels.first()

    if(!channel || channel.type !== ChannelType.GuildText) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.raid.notification", locale)}`,
                    locale, `${client.services.lang.get("commands.antinuke.collectors.raid.use_channel", locale)}`
                )
            ],
            components: [ client.storage.components.leaveCustom(locale, 'leaveRaidSystem', false) ]
        })
    }

    const old = get.channelId

    get.channelId = channel.id
    await client.db.raids.save(get)

    await client.managers.audit.send(
        get.channelId, {
            action: 'AntiRaidChannelLogEdit',
            system: 'Raid',
            locale: locale,
            member: interaction.member,
            oldChannel: interaction.guild.channels.cache.get(old) as GuildChannel | undefined,
            newChannel: channel
        }
    )

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.raid.notification", locale)}`,
                locale, `${client.services.lang.get("commands.antinuke.collectors.raid.set_channel", locale)} ${channel.toString()} ${client.services.lang.get("commands.antinuke.collectors.raid.as", locale)}`
            )
        ],
        components: [ client.storage.components.leaveCustom(locale, 'leaveRaidSystem') ]
    })
}