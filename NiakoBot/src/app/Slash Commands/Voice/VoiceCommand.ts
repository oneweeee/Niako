import BaseSlashCommand from "../../../struct/base/BaseSlashCommand";
import { ApplicationCommandOptionType } from "discord.js";

export default new BaseSlashCommand(
    'voice',
    {
        disabled: true,
        module: 'util',
        name: 'voice',
        description: '123',
        detailedDescription: '123456',
        defaultMemberPermissions: 'Administrator',
        needClientPermissions: [ 'Administrator' ],

        options: [
            {
                name: 'create',
                description: 'Добавление системы приватных комнат на сервер',
                detailedDescription: 'Создает категорию, текстовый, голосвой канал для системы приватных комнат',
                type: ApplicationCommandOptionType.Subcommand,

                options: [
                    {
                        name: 'type',
                        nameLocalizations: { 'ru': 'тип' },
                        description: 'Вариант приватных комнат, который Вы хотите видеть',
                        type: ApplicationCommandOptionType.String,
                        required: true,
                        choices: [
                            {
                                name: 'Обычный (5x5 кнопок)',
                                value: 'Default'
                            },
                            {
                                name: 'Компактный (4x4 кнопок)',
                                value: 'Compact'
                            },
                            {
                                name: 'Полный (5x5 кнопок)',
                                value: 'Full'
                            },
                            {
                                name: 'Обычный полный (5x5 кнопок)',
                                value: 'DefaultFull'
                            }
                        ]
                    }
                ]
            },


            {
                name: 'delete',
                description: 'Удаление системы приватных комнат с сервера',
                detailedDescription: 'Удаляет систему приватных комнат, которая ранее была добавлена',
                type: ApplicationCommandOptionType.Subcommand
            },


            {
                name: 'manage',
                description: 'Панель управления системой приватных комнат',
                detailedDescription: 'Открывает панель управления, где можно настроить систему приватных комнат',
                type: ApplicationCommandOptionType.Subcommand
            }
        ]
    },

    async (client, interaction, lang) => {
        await interaction.deferReply({ fetchReply: true }).catch(() => {})

        switch(interaction.options.data[0].name) {
            case 'create':
                return (await import('./VoiceCreateSubCommand/VoiceCreateSubCommand')).default(client, interaction, lang)
            case 'delete':
                return (await import('./VoiceDeleteCommand/VoiceDeleteSubCommand')).default(client, interaction, lang)
            case 'manage':
                /*const arr = [
                        'Crown', 'Rename', 'Limit', 'Kick', 'Lock', 'Unlock', 'RemoveUser', 'AddUser',
                        'Mute', 'Unmute', 'Showed', 'Usered', 'Locked', 'Muted', 'Reset', 'Info'
                    ].map((str) => {
                        const style = 'Yellow'
                        const emoji = interaction.guild.emojis.cache.find((e) => `<:${e.name}:${e.id}>` === `<:NK_S${style}Room${str}:${e.id}>`)
                        return { key: str, emoji: emoji!.toString() }
                    })
                
                let text = ('{' + '\n')
                for ( let i = 0; arr.length > i; i++) {
                    text += (`    '${arr[i].key}': '${arr[i].emoji}',` + '\n')
                }
                console.log(text + '},')
                
                return interaction.editReply({
                    content: '123'
                })*/
                return (await import('./VoiceManageSubCommand/VoiceManageSubCommand')).default(client, interaction, lang)
        }
    }
)