import BaseSlashCommand from "../../../struct/base/BaseSlashCommand";
import { ApplicationCommandOptionType } from "discord.js";

export default new BaseSlashCommand(
    'banner',
    {
        disabled: true,
        module: 'util',
        name: 'banner',
        description: '123',
        detailedDescription: '123456',
        defaultMemberPermissions: 'Administrator',
        needClientPermissions: [ 'Administrator' ],

        options: [
            {
                name: 'enable',
                description: 'Включить модуль баннера на сервере',
                detailedDescription: 'Включает модуль баннера действий на сервере',
                type: ApplicationCommandOptionType.Subcommand
            },

            {
                name: 'disable',
                description: 'Выключить модуль баннера на сервере',
                detailedDescription: 'Выключает модуль баннера действий на сервере',
                type: ApplicationCommandOptionType.Subcommand
            },

            {
                name: 'manage',
                description: 'Настроить канал с действиями',
                detailedDescription: 'Панель с настройкой канала с добавлением или удалением действий',
                type: ApplicationCommandOptionType.Subcommand
            }
        ]
    },

    async (client, interaction, lang) => {
        await interaction.deferReply({ fetchReply: true })

        return interaction.editReply({
            embeds: [
                client.storage.embeds.color()
                .setDescription('https://niako.xyz/')
            ]
        })

        switch(interaction.options.data[0].name) {
            case 'enable':
                return (await import('./BannerEnableSubCommand/BannerEnableSubCommand')).default(client, interaction, lang)
            case 'disable':
                return (await import('./BannerDisableSubCommand/BannerDisableSubCommand')).default(client, interaction, lang)
            case 'manage':
                return (await import('./BannerManageSubCommand/BannerManageSubCommand')).default(client, interaction, lang)
        }
    }
)