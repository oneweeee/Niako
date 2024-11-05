import { ApplicationCommandOptionType, ChannelType } from "discord.js";
import BaseSlashCommand from "../../../struct/base/BaseSlashCommand";
import ms from "ms";

export default new BaseSlashCommand(
    'clear',
    {
        name: 'clear',
        description: 'Очистить сообщения',
        onlyMod: true,
        options: [
            {
                name: 'count',
                description: 'Количество сообщений',
                type: ApplicationCommandOptionType.Number,
                required: true,
                minValue: 1,
            },
            {
                name: 'channel',
                description: 'Канал, где хотите удалить сообщения',
                type: ApplicationCommandOptionType.Channel,
                required: false
            },
            {
                name: 'member',
                description: 'Пользователь, от которого хотите удалить сообщения',
                type: ApplicationCommandOptionType.User,
                required: false
            },
            {
                name: 'filter',
                description: 'Удалять сообщения ото всех или от оприделенного типа пользоователя',
                type: ApplicationCommandOptionType.String,
                required: false,
                choices: [
                    { name: 'Все', value: 'all' },
                    { name: 'Боты', value: 'bot' },
                    { name: 'Игнор', value: 'ignore' },
                    { name: 'Пользователи', value: 'user' }
                ]
            },
        ]
    },
    async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true })

        const count = interaction.options.get('count', true)!.value as number
        const typeDelete = interaction.options.get('filter')?.value as string || 'all'
        const channel = interaction.options.get('channel')?.channel ?? interaction.channel!
        if(channel.type !== ChannelType.GuildText) {
            return interaction.editReply({ content: 'не текст канал' })
        }

        const member = interaction.options.getMember('member')
        if(typeDelete !== 'all' || member) {
            if(member) {
                if(typeDelete === 'ignore') {
                    (await channel.messages.fetch({ limit: count })).filter((m) => m.author.id !== member.id).map(async (m) => {
                        await m.delete().catch(() => {})
                    })
                } else {
                    (await channel.messages.fetch({ limit: count })).filter((m) => m.author.id === member.id).map(async (m) => {
                        await m.delete().catch(() => {})
                    })
                }
            }

            if(typeDelete === 'bot' || typeDelete === 'user') {
                (await channel.messages.fetch({ limit: count }))
                .filter((m) => typeDelete === 'bot' ? m.author.bot :  !m.author.bot)
                .map(async (m) => {
                    await m.delete().catch(() => {})
                })
            }
        } else {
            channel.bulkDelete(count)
        }

        return interaction.editReply({ content: 'ura' })
    }
)