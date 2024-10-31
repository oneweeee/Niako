import BaseSlashCommand from "../../../struct/base/BaseSlashCommand";
import { ApplicationCommandOptionType } from "discord.js";

export default new BaseSlashCommand(
    'modules',
    {
        disabled: true,
        module: 'util',
        name: 'modules',
        description: '123',
        detailedDescription: '456',
        defaultMemberPermissions: 'Administrator',
        needClientPermissions: [ 'Administrator' ],

        options: [
            {
                name: 'enable',
                description: 'Включить определённую команду или категорию',
                detailedDescription: 'Включает и добавляет на сервер определённую команду или категорию с командами',
                type: ApplicationCommandOptionType.Subcommand,

                options: [
                    {
                        name: 'category',
                        nameLocalizations: {
                            'ru': 'категория'
                        },

                        description: 'Категория команд, которую Вы хотите включить',
                        type: ApplicationCommandOptionType.String,
                        choices: [
                            {
                                name: 'Информация',
                                value: 'info'
                            },
                            {
                                name: 'Музыка',
                                value: 'music'
                            },
                            {
                                name: 'Утилиты',
                                value: 'util'
                            }
                        ]
                    },

                    {
                        name: 'command',
                        nameLocalizations: {
                            'ru': 'команда'
                        },

                        description: 'Команда, которую Вы хотите включить',
                        type: ApplicationCommandOptionType.String
                    }
                ]
            },

            {
                name: 'disable',
                description: 'Выключить определённую команду или категорию',
                detailedDescription: 'Выключает и убирает с сервера определённые команды или категорию с командами',
                type: ApplicationCommandOptionType.Subcommand,

                options: [
                    {
                        name: 'category',
                        nameLocalizations: {
                            'ru': 'категория'
                        },

                        description: 'Категория команд, которую Вы хотите включить',
                        type: ApplicationCommandOptionType.String,
                        choices: [
                            {
                                name: 'Информация',
                                value: 'info'
                            },
                            {
                                name: 'Музыка',
                                value: 'music'
                            },
                            {
                                name: 'Утилиты',
                                value: 'util'
                            }
                        ]
                    },

                    {
                        name: 'command',
                        nameLocalizations: {
                            'ru': 'команда'
                        },

                        description: 'Команда, которую Вы хотите включить',
                        type: ApplicationCommandOptionType.String
                    }
                ]
            },

            {
                name: 'list',
                description: 'Посмотреть список включенных и выключенных команд',
                detailedDescription: 'Показывает список со включенными и выключенными командами сервера',
                type: ApplicationCommandOptionType.Subcommand
            }
        ]
    },

    async (client, interaction, lang) => {
        await interaction.deferReply({ fetchReply: true })

        switch(interaction.options.data[0].name) {
            case 'enable':
                return (await import('./ModulesEnableSubCommand/ModulesEnableSubCommand')).default(client, interaction, lang)
            case 'disable':
                return (await import('./ModulesDisableSubCommand/ModulesDisableSubCommand')).default(client, interaction, lang)
            case 'list':
                return (await import('./ModulesListSubCommand/ModulesListSubCommand')).default(client, interaction, lang)
        }
    }
)