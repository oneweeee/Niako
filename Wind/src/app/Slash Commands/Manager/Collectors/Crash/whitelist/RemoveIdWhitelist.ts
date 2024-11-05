import { CommandInteraction, ModalSubmitInteraction, Locale } from "discord.js"
import WindClient from "#client"

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, locale: Locale) => {
    const res = await client.db.crashs.get(interaction.guildId)

    const userId = modal.fields.getTextInputValue('id')

    if(!res.whiteList.includes(userId)) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.remove_whitelist", locale)}`,
                    locale, `${client.services.lang.get("commands.antinuke.collectors.crash.no_whitelist_user", locale)}`
                )
            ],
            components: [ client.storage.components.leaveCustom(locale, 'leaveWhitelist') ]
        })
    }

    res.whiteList.splice(res.whiteList.indexOf(userId), 1)
    await client.db.crashs.save(res)

    await client.managers.audit.send(
        res.channelId, {
            action: 'AntiCrashWhitelistRemove',
            system: 'Crash',
            locale: locale,
            member: interaction.member,
            remove: interaction.guild.members.cache.get(userId)
        }
    )

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.antinuke.collectors.crash.remove_whitelist", locale)}`,
                locale, `${client.services.lang.get("commands.antinuke.collectors.crash.you_remove", locale)} <@!${userId}> ${client.services.lang.get("commands.antinuke.collectors.crash.whitelist_remove_user", locale)}`
            )
        ],
        components: [ client.storage.components.leaveCustom(locale, 'leaveWhitelist') ]
    })
}