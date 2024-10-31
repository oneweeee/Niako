import BaseSlashCommand from "../../../struct/base/BaseSlashCommand";
import { ApplicationCommandOptionType } from "discord.js";

export default new BaseSlashCommand(
    'group',
    {
        module: 'util',
        name: 'group',
        description: '123',
        detailedDescription: '123456',
        defaultMemberPermissions: 'Administrator',
        needClientPermissions: [ 'Administrator' ],

        options: [
            {
                name: 'delete',
                description: 'Удаление системы групп с сервера',
                detailedDescription: 'Удаляет систему гркпп, которая ранее была добавлена',
                type: ApplicationCommandOptionType.Subcommand
            },

            {
                name: 'create',
                description: 'Добавление системы групп на сервер',
                detailedDescription: 'Создает категорию, а также текстовый канал, в котором Вы сможете создать группу',
                type: ApplicationCommandOptionType.Subcommand
            },

            {
                name: 'manage',
                description: 'Панель управления системой личных групп сервера',
                detailedDescription: 'Показывает в панель, в которой Вы можете кастомизировать привтаные группы сервера',
                type: ApplicationCommandOptionType.Subcommand
            }
        ]
    },

    async (client, interaction, lang) => {
        await interaction.deferReply({ fetchReply: true })

        switch(interaction.options.data[0].name) {
            case 'create':
                return (await import('./GroupCreateSubCommand/GroupCreateSubCommand')).default(client, interaction, lang)
            case 'delete':
                return (await import('./GroupDeleteSubCommand/GroupDeleteSubCommand')).default(client, interaction, lang)
            case 'manage':
                return (await import('./GroupManageSubCommand/GroupManageSubCommand')).default(client, interaction, lang)
        }
    }
)