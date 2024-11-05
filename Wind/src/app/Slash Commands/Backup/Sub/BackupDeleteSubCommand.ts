import { CommandInteraction, Locale } from "discord.js";
import WindClient from "#client";

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, locale: Locale) => {
    await interaction.deferReply()

    const value = interaction.options.get('backup')?.value as string
    const backups = await client.db.backups.getMemberBackups(interaction.member)

    const res = backups.find((b) => client.db.backups.getDocKey(b) === value)
    if(!res) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.backup.delete_copy", locale)}`,
                    locale, `${client.services.lang.get("commands.backup.failed_find_copy", locale)}`
                )
            ]
        })
    }

    const parse = client.util.parseJSON(res.data)
    if(!parse) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.backup.delete_copy", locale)}`,
                    locale, `${client.services.lang.get("commands.backup.failed_find_date", locale)}`
                )
            ]
        })
    }
    
    const message = await interaction.editReply({
        embeds: [
            client.storage.embeds.choose(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.backup.delete_copy", locale)}`,
                locale, `${client.services.lang.get("commands.backup.you_sure_delete_copy", locale)} **${res.name}**?`
            ).addFields(
                {
                    name: `> ${client.services.lang.get("commands.backup.info", locale)}:`,
                    value: (
                        `**・**${client.services.lang.get("commands.backup.name_server", locale)}: **${parse.name}**` + '\n'
                        + `**・**${client.services.lang.get("commands.backup.image", locale)}: ${parse?.icon ? `[${client.services.lang.get("commands.backup.icon", locale)}](${parse.icon})` : ''}${parse.banner ? ` | [${client.services.lang.get("commands.backup.banner", locale)}](${parse?.banner})` : ''}${parse.splash ? ` | [${client.services.lang.get("commands.backup.invite", locale)}](${parse?.splash})` : ''}` + '\n'
                        + `**・**${client.services.lang.get("commands.backup.roles", locale)}: **${parse.roles.length}**` + '\n'
                        + `**・**${client.services.lang.get("commands.backup.channels", locale)}: **${parse.channels.length}**` + '\n'
                    )
                }
            ).setFooter({ text: `・${client.services.lang.get("commands.backup.no_restore", locale)}` })
        ], components: client.storage.components.choose()
    })

    return client.storage.collectors.interaction(
        interaction, message, async (int) => {
            if(!int.isButton()) return

            if(int.customId === 'refuse') {
                return interaction.deleteReply()
            }

            await client.db.backups.remove(res)

            return interaction.editReply({
                embeds: [
                    client.storage.embeds.default(
                        interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.backup.delete_copy", locale)}`,
                        locale, `${client.services.lang.get("commands.backup.deleted", locale)} **${res.name}** (<t:${Math.round(res.createdTimestamp / 1000)}:D>)`
                    )
                ],
                components: []
            })
        }
    )
}