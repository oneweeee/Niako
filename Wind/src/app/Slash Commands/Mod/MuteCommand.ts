import { ApplicationCommandOptionType } from "discord.js";
import BaseSlashCommand from "#base/BaseSlashCommand";
import ms from "ms";

export default new BaseSlashCommand(
    {
        name: 'mute',
        description: 'Mute',
        descriptionLocalizations: {
            'ru': 'Заглушить'
        },
        category: 'mod',
        options: [
            {
                name: 'type',
                nameLocalizations: {
                    'ru': 'тип'
                },
                description: 'Type',
                descriptionLocalizations: {
                    'ru': 'Тип'
                },
                type: ApplicationCommandOptionType.String,
                required: true,
                choices: [
                    { name: 'Общий', value: 'general' },
                    { name: 'Голосовой', value: 'voice' },
                    { name: 'Текстовый', value: 'text' },
                    { name: 'Таймаут', value: 'timeout' }
                ]
            },
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
            },
            {
                name: 'time',
                nameLocalizations: {
                    'ru': 'время'
                },
                description: 'Time',
                descriptionLocalizations: {
                    'ru': 'Время'
                },
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'reason',
                nameLocalizations: {
                    'ru': 'причина'
                },
                description: 'Reason',
                descriptionLocalizations: {
                    'ru': 'Причина'
                },
                type: ApplicationCommandOptionType.String
            },
        ]
    },
    async (client, interaction, { locale }) => {
        const doc = await client.db.guilds.get(interaction.guildId, locale)
        if(
            interaction.guild.ownerId !== interaction.user.id &&
            !interaction.member.permissions.has('Administrator') &&
            !client.config.developers.includes(interaction.user.id) &&
            !client.util.hasRole(interaction.member, doc.accessActionRoles)
        ) {
            return interaction.reply({ content: `${client.services.lang.get("commands.info.no_rights", locale)}`, ephemeral: true })
        }

        const target = interaction.options.getMember('user')!
        if(!target) {
            return interaction.reply({ content: `${client.services.lang.get("пользователь не найден", locale)}`, ephemeral: true })
        }
        
        if(target.user.bot) {
            return interaction.reply({ content: `${client.services.lang.get("на ботах юзать нельзя", locale)}`, ephemeral: true })
        }

        if(target.id === interaction.member.id) {
            return interaction.reply({ content: `${client.services.lang.get("на себе юзать нельзя", locale)}`, ephemeral: true })
        }

        const mute = interaction.options.get('type', true)?.value as string
        const reason = interaction.options.get('reason')?.value as string || undefined
        const time = (interaction.options.get('time', true)?.value as string | undefined) || '0s'
        
        if(time && !client.util.isActionTime(time)) {
            return interaction.reply({ content: `${client.services.lang.get("некорректное время", locale)}`, ephemeral: true })
        }

        await interaction.deferReply()
        
        let type: any = 'Timeout'
    
        switch(mute) {
            case 'general':
                type = 'GMute'
                if(doc.mutes.general?.roleId) {
                    if(!interaction.guild.roles.cache.has(doc.mutes.general.roleId)) {
                        return interaction.editReply({
                            embeds: [
                                client.storage.embeds.default(
                                    interaction.member, client.db.guilds.getColor(interaction.guildId), `Мут участника`,
                                    locale, `Неизвестная мне роль`,
                                    { indicateTitle: true, target }
                                )
                            ]
                        })
                    }

                    if(target.roles.cache.has(doc.mutes.general.roleId)) {
                        return interaction.editReply({
                            embeds: [
                                client.storage.embeds.default(
                                    interaction.member, client.db.guilds.getColor(interaction.guildId), `Мут участника`,
                                    locale, `Пользователь ${target.toString()} уже **заглушен**`,
                                    { indicateTitle: true, target }
                                )
                            ]
                        })
                    }
                    await target.roles.add(doc.mutes.general.roleId).catch(() => {})
                } else {
                    return interaction.editReply({
                        embeds: [
                            client.storage.embeds.default(
                                interaction.member, client.db.guilds.getColor(interaction.guildId), `Мут участника`,
                                locale, `Роль не установлена`,
                                { indicateTitle: true, target }
                            )
                        ]
                    })
                }
                break
            case 'voice':
                type = 'VMute'
                if(doc.mutes.voice?.roleId) {
                    if(!interaction.guild.roles.cache.has(doc.mutes.voice.roleId)) {
                        return interaction.editReply({
                            embeds: [
                                client.storage.embeds.default(
                                    interaction.member, client.db.guilds.getColor(interaction.guildId), `Мут участника`,
                                    locale, `Неизвестная мне роль`,
                                    { indicateTitle: true, target }
                                )
                            ]
                        })
                    }

                    if(target.roles.cache.has(doc.mutes.voice.roleId)) {
                        return interaction.editReply({
                            embeds: [
                                client.storage.embeds.default(
                                    interaction.member, client.db.guilds.getColor(interaction.guildId), `Мут участника`,
                                    locale, `Пользователь ${target.toString()} уже **заглушен**`,
                                    { indicateTitle: true, target }
                                )
                            ]
                        })
                    }
                    await target.roles.add(doc.mutes.voice.roleId).catch(() => {})
                } else {
                    return interaction.editReply({
                        embeds: [
                            client.storage.embeds.default(
                                interaction.member, client.db.guilds.getColor(interaction.guildId), `Мут участника`,
                                locale, `Роль не установлена`,
                                { indicateTitle: true, target }
                            )
                        ]
                    })
                }
                break
            case 'text':
                type = 'TMute'
                if(doc.mutes.text?.roleId) {
                    if(!interaction.guild.roles.cache.has(doc.mutes.text.roleId)) {
                        return interaction.editReply({
                            embeds: [
                                client.storage.embeds.default(
                                    interaction.member, client.db.guilds.getColor(interaction.guildId), `Мут участника`,
                                    locale, `Неизвестная мне роль`,
                                    { indicateTitle: true, target }
                                )
                            ]
                        })
                    }

                    if(target.roles.cache.has(doc.mutes.text.roleId)) {
                        return interaction.editReply({
                            embeds: [
                                client.storage.embeds.default(
                                    interaction.member, client.db.guilds.getColor(interaction.guildId), `Мут участника`,
                                    locale, `Пользователь ${target.toString()} уже **заглушен**`,
                                    { indicateTitle: true, target }
                                )
                            ]
                        })
                    }
                    await target.roles.add(doc.mutes.text.roleId).catch(() => {})
                } else {
                    return interaction.editReply({
                        embeds: [
                            client.storage.embeds.default(
                                interaction.member, client.db.guilds.getColor(interaction.guildId), `Мут участника`,
                                locale, `Роль не установлена`,
                                { indicateTitle: true, target }
                            )
                        ]
                    })
                }
                break
            default:
                target?.isCommunicationDisabled()
                if(target?.communicationDisabledUntil) {
                    return interaction.editReply({
                        embeds: [
                            client.storage.embeds.default(
                                interaction.member, client.db.guilds.getColor(interaction.guildId), `Мут участника`,
                                locale, `Пользователь ${target.toString()} уже **заглушен**`,
                                { indicateTitle: true, target }
                            )
                        ]
                    })
                }
                await target.timeout(ms(time), reason).catch(() => {})
        }
    
        const res = await client.db.guildMembers.get(target)
        res.actions.push(
            {
                type,
                executorId: interaction.member.id,
                createdTimestamp: Date.now(),
                active: true,
                time: time === '0' ? 0 : ms(time),
                reason
            }
        )
        await client.db.guildMembers.save(res)
        await client.db.audits.sendCustomModLogger('GuildMuteAdd', interaction.member, target, { reason, time }, interaction.guildLocale)
    
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `Мут участника`,
                    locale, `Вы **успешно** заглушили ${target.toString()} на **${time}**${reason ? `, по причине: \`${reason}\`` : ''}`,
                    { indicateTitle: true, target }
                )
            ]
        })
    }
)