import { ApplicationCommandOptionType } from "discord.js";
import BaseSlashCommand from "#base/BaseSlashCommand";

export default new BaseSlashCommand(
    {
        name: 'action',
        description: 'Action',
        descriptionLocalizations: {
            'ru': 'Действие'
        },
        disabled: true,
        category: 'mod',
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
                type: ApplicationCommandOptionType.User,
                required: true
            }
        ]
    },
    async (client, interaction, { locale }) => {
        const res = await client.db.guilds.get(interaction.guildId, locale)
        if(
            interaction.guild.ownerId !== interaction.user.id &&
            !interaction.member.permissions.has('Administrator') &&
            !client.config.developers.includes(interaction.user.id) &&
            !client.util.hasRole(interaction.member, res.accessActionRoles)
        ) {
            return interaction.reply({ content: `${client.services.lang.get("commands.info.no_rights", locale)}`, ephemeral: true })
        }

        const target = interaction.options.getMember('user')!

        if(target.user.bot) {
            return interaction.reply({ content: `${client.services.lang.get("на ботах юзать нельзя", locale)}`, ephemeral: true })
        }

        if(target.id === interaction.member.id) {
            return interaction.reply({ content: `${client.services.lang.get("на себе юзать нельзя", locale)}`, ephemeral: true })
        }

        await interaction.deferReply()

        const crash = await client.db.crashs.get(interaction.guildId)

        const message = await interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `Взаимодействия с участником`,
                    locale, `Выберите, что **хотите** сделать с ${target.toString()}?`,
                    { indicateTitle: true, target }
                )
            ],
            components: client.storage.components.action(target, crash.banId, res, locale)
        })

        return client.storage.collectors.interaction(
            interaction, message, async (int) => {
                if(int.isButton()) {
                    switch(int.customId) {
                        case 'leave':
                            const member = await target.fetch().catch(() => null)
                            if(!member) {
                                return int.reply({ content: `Участник с ID ${target?.id} не найден`, ephemeral: true })
                            }
                            return interaction.editReply({
                                embeds: [
                                    client.storage.embeds.default(
                                        interaction.member, client.db.guilds.getColor(interaction.guildId), `Взаимодействия с участником`,
                                        locale, `Выберите, что **хотите** сделать с ${member.toString()}?`,
                                        { indicateTitle: true, target: member }
                                    )
                                ],
                                components: client.storage.components.action(member, crash.banId, res, locale)
                            })
                        case 'ban':
                            return (await import('./Collectors/Ban/ShowModalBan')).default(client, interaction, int, locale)
                        case 'lockown':
                            return (await import('./Collectors/Lockdown/ShowModalLockdown')).default(client, interaction, int, locale)
                        case 'unlockdown':
                            return (await import('./Collectors/Lockdown/AgreeUnlockdown')).default(client, interaction, target, int, locale)
                        case 'mute':
                            return (await import('./Collectors/Mute/ChooseMute')).default(client, interaction, target, int, locale)
                        case 'general.mute':
                        case 'text.mute':
                        case 'voice.mute':
                        case 'timeout.mute':
                            return (await import('./Collectors/Mute/ShowModalMute')).default(client, interaction, int, locale)
                        case 'unmute':
                            return (await import('./Collectors/Mute/AgreeUnmute')).default(client, interaction, target, int, locale)
                    }
                } else if(int.isModalSubmit()) {
                    switch(int.customId) {
                        case 'modalBan':
                            return (await import('./Collectors/Ban/AgreeBan')).default(client, interaction, target, int, locale)
                        case 'modalLockdown':
                            return (await import('./Collectors/Lockdown/AgreeLockdown')).default(client, interaction, target, int, locale)
                        default:
                            return (await import('./Collectors/Mute/AgreeMemberMute')).default(client, interaction, target, int, locale)
                    }
                }
            }
        )
    }
)