import { ApplicationCommandOptionType } from "discord.js";
import BaseSlashCommand from "#base/BaseSlashCommand";
import moment from "moment-timezone";

export default new BaseSlashCommand(
    {
        name: 'backup',
        description: 'Create a copy of the server',
        descriptionLocalizations: {
            'ru': 'Создать копию сервера'
        },
        category: 'settings',
        options: [
            {
                name: 'create',
                description: 'Create a copy of the server',
                descriptionLocalizations: {
                    'ru': 'Создать копию сервера'
                },
                type: ApplicationCommandOptionType.Subcommand
            },
            {
                name: 'load',
                description: 'Download a copy of the server',
                descriptionLocalizations: {
                    'ru': 'Загрузить копию сервера'
                },
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'backup',
                        description: 'Select the copy you need',
                        descriptionLocalizations: {
                            'ru': 'Выберите нужную вам копию'
                        },
                        type: ApplicationCommandOptionType.String,
                        required: true,
                        autocomplete: true
                    },
                    {
                        name: 'synchronization',
                        description: 'Restore what was deleted',
                        descriptionLocalizations: {
                            'ru': 'Восстановить то что было удалено'
                        },
                        type: ApplicationCommandOptionType.String,
                        choices: [
                            {
                                name: 'Yes',
                                nameLocalizations: {
                                    'ru': 'Да'
                                },
                                value: 'yes'
                            },
                            {
                                name: 'No',
                                nameLocalizations: {
                                    'ru': 'Нет'
                                },
                                value: 'no'
                            }
                        ]
                    }
                ]
            },
            {
                name: 'delete',
                description: 'Delete a copy of the server',
                descriptionLocalizations: {
                    'ru': 'Удалить копию сервера'
                },
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'backup',
                        description: 'Select the copy you need',
                        descriptionLocalizations: {
                            'ru': 'Выберите нужную вам копию'
                        },
                        type: ApplicationCommandOptionType.String,
                        required: true,
                        autocomplete: true
                    }
                ]
            }
        ]
    },
    async (client, interaction, { locale }) => {
        if(
            interaction.guild.ownerId !== interaction.user.id &&
            !interaction.member.permissions.has('Administrator') &&
            !client.config.developers.includes(interaction.user.id)
        ) {
            return interaction.reply({ content: `${client.services.lang.get("commands.backup.no_rights", locale)}`, ephemeral: true })
        }

        switch(interaction.options.data[0].name) {
            case 'create':
                return (await import('./Sub/BackupCreateSubCommand')).default(client, interaction, locale)
            case 'delete':
                return (await import('./Sub/BackupDeleteSubCommand')).default(client, interaction, locale)    
            case 'load':
                return (await import('./Sub/BackupLoadSubCommand')).default(client, interaction, locale)
        }
    },
    async (client, autocomplete) => {
        const backups = await client.db.backups.getMemberBackups(autocomplete.member)
        
        return autocomplete.respond(
            backups.map((b) => {
                const date = moment(b.createdTimestamp).tz(`Europe/Moscow`).locale('ru-RU').format('HH:mm | DD.MM.YYYY')
                return (
                    { name: `${b.name} [${date}]`, value: client.db.backups.getDocKey(b) }
                )
            })
        )
    }
)