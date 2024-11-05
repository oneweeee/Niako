import { ApplicationCommandOptionType } from "discord.js"
import BaseSlashCommand from "#base/BaseSlashCommand"

export default new BaseSlashCommand(
    {
        name: 'userinfo',
        description: 'Информация о пользователе',
        descriptionLocalizations: {
            'ru': 'Информация о пользователе',
            'en-US': 'User information'
        },
        category: 'info',
        options: [
            {
                name: 'пользователь',
                nameLocalizations: {
                    'ru': 'пользователь',
                    'en-US': 'user'
                },
                description: 'Пользователь',
                descriptionLocalizations: {
                    'ru': 'Пользователь',
                    'en-US': 'User'
                },
                type: ApplicationCommandOptionType.User
            }
        ]
    },

    async (client, interaction, { locale }) => {
        await interaction.deferReply()

        const member = interaction.options.getMember('пользователь') ?? interaction.member

        return interaction.editReply({embeds: await client.storage.embeds.userinfo(member, client.db.guilds.getColor(interaction.guildId), locale)})
    }
)