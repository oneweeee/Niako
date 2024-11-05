import { ApplicationCommandOptionType, Collection } from "discord.js"
import BaseSlashCommand from "#base/BaseSlashCommand"

export default new BaseSlashCommand(
    {
        name: 'help',
        description: 'Помощь',
        descriptionLocalizations: {
            'ru': 'Помощь',
            'en-US': 'Help'
        },
        category: 'info'
    },

    async (client, interaction, { locale }) => {
        await interaction.deferReply()

        const embed = client.storage.embeds.color(client.db.guilds.getColor(interaction.guildId))
        .setTitle(`Помощь по командам бота ${client.user.globalName ?? client.user.username}`)
        .setFooter({
            text: `Всего команд: ${client.watchers.slashCommands.cache.size}`,
            iconURL: client.util.getAvatar(client.user) ?? undefined
        }).
        setTimestamp()

        const row = client.storage.components.rowStringMenu('help');

        [ ...client.watchers.slashCommands.categorys.values() ].sort().map((cat) => {
            const commands = client.watchers.slashCommands.cache.filter((c) => c.options.category === cat)
            embed.addFields(
                {
                    name: `> ${client.util.getCategory(cat, locale)}:`,
                    value: commands.map((c) => `\`${c.options.name}\``).join(', ')
                }
            )

            row.components[0].addOptions(
                { label: client.util.getCategory(cat, locale), value: cat }
            )
        })

        const coll: Collection<string, string> = new Collection()
        client.application.commands.cache.map((c) => coll.set(c.name, c.id))

        const message = await interaction.editReply({
            embeds: [ embed ], components: [ row ]
        })

        return client.storage.collectors.interaction(
            interaction, message, async (int) => {
                if(!int.isStringSelectMenu()) return

                const cat = int.values[0]
                const commands = client.watchers.slashCommands.cache.filter(
                    (c) => c.options.category === cat
                )

                const embed = client.storage.embeds.color(client.db.guilds.getColor(interaction.guildId))
                .setTitle(`Список команд "${client.util.getCategory(cat, locale)}"`)
                .setFooter({
                    text: `Всего команд: ${commands.size}`,
                    iconURL: client.util.getAvatar(client.user) ?? undefined
                })
                .setTimestamp()
                .setDescription(
                    commands.map((c) => {
                        if(c.options?.options && c.options?.options.filter((c) => c.type === ApplicationCommandOptionType.Subcommand).length > 0) {
                            return c.options?.options.filter((c) => c.type === ApplicationCommandOptionType.Subcommand).map(
                                (o) => {
                                    return `**・**</${c.options.name} ${o.name}:${coll.get(c.options.name) || '0'}> — ${(o?.descriptionLocalizations || {})[locale] || o.description}`
                                }
                            ).join('\n')
                        } else {
                            return `**・**</${c.options.name}:${coll.get(c.options.name) || '0'}> — ${(c.options?.descriptionLocalizations || {})[locale] || c.options.description}`
                        }
                    }).join('\n')
                )
        
                return int.reply({ embeds: [ embed ], ephemeral: true })
            }
        )
    }
)