import BaseSlashCommand from "../../../struct/base/BaseSlashCommand";
import { ApplicationCommandOptionType } from "discord.js";

export default new BaseSlashCommand(
    'logger',
    {
        disabled: true,
        module: 'util',
        name: 'logger',
        description: '123',
        detailedDescription: '123456',
        defaultMemberPermissions: 'Administrator',
        needClientPermissions: [ 'Administrator' ],

        options: [
            {
                name: 'enable',
                description: 'Включить модуль логирования на сервере',
                detailedDescription: 'Включает модуль логирования действий на сервере',
                type: ApplicationCommandOptionType.Subcommand
            },

            {
                name: 'disable',
                description: 'Выключить модуль логирования на сервере',
                detailedDescription: 'Выключает модуль логирования действий на сервере',
                type: ApplicationCommandOptionType.Subcommand
            },

            {
                name: 'list',
                description: 'Посмотреть каналы с включенными в них логами или отсутсвующими',
                detailedDescription: 'Показывает список логов и к ним прилагает каналы либо пишет об их отсутствии',
                type: ApplicationCommandOptionType.Subcommand
            },

            {
                name: 'manage',
                description: 'Настроить канал с действиями',
                detailedDescription: 'Панель с настройкой канала с добавлением или удалением действий',
                type: ApplicationCommandOptionType.Subcommand,

                options: [
                    {
                        name: 'канал',
                        description: 'Укажите канал, на который Вы хотите настроить действия',
                        type: ApplicationCommandOptionType.Channel,
                        required: true
                    }
                ]
            }
        ]
    },

    async (client, interaction, lang) => {
        await interaction.deferReply({ fetchReply: true })

        switch(interaction.options.data[0].name) {
            case 'enable':
                return (await import('./LoggerEnableSubCommand/LoggerEnableSubCommand')).default(client, interaction, lang)
            case 'disable':
                return (await import('./LoggerDisableSubCommand/LoggerDisableSubCommand')).default(client, interaction, lang)
            case 'list':
                return (await import('./LoggerListSubCommand/LoggerListSubCommand')).default(client, interaction, lang)
            case 'manage':
                return (await import('./LoggerManageSubCommand/LoggerManageSubCommand')).default(client, interaction, lang)
        }
    }
)