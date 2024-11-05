import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import BaseSlashCommand from "#base/BaseSlashCommand";

export default new BaseSlashCommand(
    {
        name: 'clear',
        description: 'Clear message',
        descriptionLocalizations: {
            'ru': 'Очистка сообщений'
        },
        defaultMemberPermissions: [ 'ManageMessages' ],
        category: 'mod',
        options: [
            {
                name: 'count',
                nameLocalizations: {
                    'ru': 'количество'
                },
                description: 'Count',
                descriptionLocalizations: {
                    'ru': 'Количество'
                },
                type: ApplicationCommandOptionType.Number,
                minValue: 1,
                maxValue: 1000,
                required: true
            },
            {
                name: 'user',
                nameLocalizations: {
                    'ru': 'пользователь'
                },
                description: 'User',
                descriptionLocalizations: {
                    'ru': 'Пользователь'
                },
                type: ApplicationCommandOptionType.User,
            },
            {
                name: 'channel',
                nameLocalizations: {
                    'ru': 'канал'
                },
                description: 'Channel',
                descriptionLocalizations: {
                    'ru': 'Канал'
                },
                type: ApplicationCommandOptionType.Channel
            }
        ]
    },
    async (client, interaction, { locale }) => {
        await interaction.deferReply()

        let count = interaction.options.get('count', true).value! as number
        const user = interaction.options.getUser('user')
        const channel = interaction.options.get('channel')?.channel || interaction.channel
        if(channel?.type !== ChannelType.GuildText) {
            return interaction.editReply({ content: `Канал не текстовый` })
        }

        let users: Set<string> | undefined = undefined

        count = count > 1000 ? 1000 : count
        if(user) {
            users = new Set()
            users.add(user.id)
        }

        let countDeleted = 0
        let embed = client.storage.embeds.color(client.db.guilds.getColor(interaction.guildId))

        const msg = await interaction.editReply({
            embeds: [
                embed.setDescription(
                    `Очистка сообщений:` + '\n'
                    + `${client.util.barDraw(countDeleted, count)} \`[${countDeleted}/${count}]\`` + '\n'
                    + `Пожалуйста, подождите...`
                )
            ]
        })

        const messages = await client.util.fetchMessages(channel, { lastId: msg.id, limit: count, users })
        
        count = messages.size

        await interaction.editReply({
            embeds: [
                embed.setDescription(
                    `Очистка сообщений:` + '\n'
                    + `${client.util.barDraw(countDeleted, count)} \`[${countDeleted}/${count}]\`` + '\n'
                    + `Пожалуйста, подождите...`
                )
            ]
        })

        for ( let j = 0; messages.size > countDeleted; j++ ) {
            const new_messages = messages.first(100)
            countDeleted += new_messages.length
            await channel.bulkDelete(new_messages, true).catch(() => {})

            await interaction.editReply({
                embeds: [
                    embed.setDescription(
                        `Очистка сообщений:` + '\n'
                        + `${client.util.barDraw(countDeleted, count)} \`[${countDeleted}/${count}]\`` + '\n'
                        + `Пожалуйста, подождите...`
                    )
                ]
            })
        }
  
        return interaction.editReply({
            embeds: [
                embed.setDescription(
                    `✅ Очищено **${countDeleted}** сообщений! Сообщения двухнедельной давности были пропущены.`
                )
            ]
        }).then((m) => setTimeout(() => m.delete().catch(() => {}), 30000))
    }
)