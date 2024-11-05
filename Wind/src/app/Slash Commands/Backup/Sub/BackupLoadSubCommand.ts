import { CommandInteraction, Locale } from "discord.js";
import WindClient from "#client";

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, locale: Locale) => {
    await interaction.deferReply()

    const value = interaction.options.get('backup')?.value as string
    const synchronization = (interaction.options.get('synchronization')?.value) === 'yes'
    const backups = await client.db.backups.getMemberBackups(interaction.member)

    const res = backups.find((b) => client.db.backups.getDocKey(b) === value)
    if(!res) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.backup.loading_copy_load", locale)}`,
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
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.backup.loading_copy_load", locale)}`,
                    locale, `${client.services.lang.get("commands.backup.failed_find_date", locale)}`
                )
            ]
        })
    }
    
    const message = await interaction.editReply({
        embeds: [
            client.storage.embeds.choose(
                interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.backup.loading_copy_load", locale)}`,
                locale, `${client.services.lang.get("commands.backup.you_sure_load_copy", locale)} **${res.name}**?`
            ).addFields(
                {
                    name: `> ${client.services.lang.get("commands.backup.info", locale)}:`,
                    value: (
                        `**・**${client.services.lang.get("commands.backup.name_server", locale)}: **${parse.name}**` + '\n'
                        + `**・**${client.services.lang.get("commands.backup.image", locale)}: ${parse?.icon ? `[${client.services.lang.get("commands.backup.icon", locale)}](${parse.icon})` : ''}${parse.banner ? ` | [${client.services.lang.get("commands.backup.banner", locale)}](${parse?.banner})` : ''}${parse.splash ? ` | [${client.services.lang.get("commands.backup.invite", locale)}](${parse?.splash})` : ''}` + '\n'
                        + `**・**${client.services.lang.get("commands.backup.roles", locale)}: **${parse.roles.length}**` + '\n'
                        + `**・**${client.services.lang.get("commands.backup.channels", locale)}: **${parse.channels.length}**` + '\n'
                    )
                },
                {
                    name: '** **',
                    value: (
                        `${client.emoji.backup.exclamation}**・**${client.services.lang.get("commands.backup.make_sure", locale)} ${client.user.toString()} ${client.services.lang.get("commands.backup.permission", locale)}` + '\n'
                        + `${client.emoji.backup.warn}**・**${client.services.lang.get("commands.backup.error_load", locale)}`
                    )
                }
            )
        ], components: client.storage.components.choose()
    })

    return client.storage.collectors.interaction(
        interaction, message, async (int) => {
            if(!int.isButton()) return

            if(int.customId === 'refuse') {
                return interaction.deleteReply()
            }

            await interaction.editReply({
                embeds: [
                    client.storage.embeds.color(client.db.guilds.getColor(interaction.guildId))
                    .setTitle(`${client.services.lang.get("commands.backup.loades.title", locale)}`)
                    .setDescription(`${client.services.lang.get("commands.backup.loades.description", locale)}`)
                ],
                components: []
            })

            await int.deferUpdate()

            return client.db.backups.load(interaction.guild, interaction.channelId, res, synchronization).then((answer) => {
                if(!answer?.status) {
                    return interaction.editReply({
                        embeds: [
                            client.storage.embeds.default(
                                interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.backup.loading_copy_load", locale)}`,
                                locale, `${client.services.lang.get("commands.backup.failed_load", locale)} **${res.name}**`
                            )
                        ]
                    })
                }
    
                const embed = client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.backup.loading_copy_load", locale)}`,
                    locale, `${client.services.lang.get("commands.backup.success_load", locale)} **${res.name}**`
                )
    
                if(answer.errors.length > 0) {
                    embed.addFields({
                        name: `> ${client.services.lang.get("commands.backup.errors", locale)}:`,
                        value: (answer.errors.length > 10 ? answer.errors.slice(0, 10) : answer.errors).map((e) => `・**${e.name}**: ${e.err.message}`).join('\n')
                    })
                }
    
                return interaction.editReply({ embeds: [ embed ] })    
            })
        }
    )
}