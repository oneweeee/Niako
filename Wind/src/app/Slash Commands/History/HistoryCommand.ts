import BaseSlashCommand from "#base/BaseSlashCommand";
import { ApplicationCommandOptionType } from "discord.js";

export default new BaseSlashCommand(
    {
        name: 'history',
        description: 'prkol',
        category: 'mod',
        options: [
            {
                name: 'nicknames',
                description: 'History nicknames',
                descriptionLocalizations: {
                    'ru': 'История никнеймов'
                },
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'user',
                        nameLocalizations: {
                            'ru': 'пользователь'
                        },
                        description: 'User',
                        descriptionLocalizations: {
                            'ru': 'Пользователь'
                        },
                        type: ApplicationCommandOptionType.User
                    }        
                ]
            },
            {
                name: 'pushments',
                description: 'History pushments',
                descriptionLocalizations: {
                    'ru': 'История наказаний'
                },
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'user',
                        nameLocalizations: {
                            'ru': 'пользователь'
                        },
                        description: 'User',
                        descriptionLocalizations: {
                            'ru': 'Пользователь'
                        },
                        type: ApplicationCommandOptionType.User
                    }        
                ]
            }
        ]
    },
    async (client, interaction, { locale }) => {
        await interaction.deferReply()

        switch(interaction.options.data[0].name) {
            case 'nicknames':
                return (await import('./Sub/HistoryNicknamesSubCommand')).default(client, interaction, locale)
            case 'pushments':
                return (await import('./Sub/HistoryPushmentsSubCommand')).default(client, interaction, locale)    
        }
    }
)