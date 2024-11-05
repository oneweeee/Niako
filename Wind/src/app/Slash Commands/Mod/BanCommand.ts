import { ApplicationCommandOptionType } from "discord.js";
import BaseSlashCommand from "#base/BaseSlashCommand";
import ms from "ms";

export default new BaseSlashCommand(
    {
        name: 'ban',
        description: 'Ban',
        descriptionLocalizations: {
            'ru': 'Бан'
        },
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
        const res = await client.db.guilds.get(interaction.guildId, locale)
        if(
            interaction.guild.ownerId !== interaction.user.id &&
            !interaction.member.permissions.has('Administrator') &&
            !client.config.developers.includes(interaction.user.id) &&
            !client.util.hasRole(interaction.member, res.accessActionRoles)
        ) {
            return interaction.reply({ content: `${client.services.lang.get("commands.info.no_rights", locale)}`, ephemeral: true })
        }

        const reason = interaction.options.get('reason')?.value as string || undefined
        const time = (interaction.options.get('time', true)?.value as string | undefined) || '0'

        if(time && !client.util.isActionTime(time)) {
            return interaction.reply({ content: `${client.services.lang.get("некорректное время", locale)}`, ephemeral: true })
        }

        const target = interaction.options.getMember('user')
        if(!target) {
            const user = interaction.options.getUser('user')
            if(!user) {
                return interaction.reply({ content: `${client.services.lang.get("пользователь не найден", locale)}`, ephemeral: true })
            }

            const doc = await client.db.guildMembers.getOptions(interaction.guildId, user.id)
            return interaction.guild.bans.create(user, { reason }).then(async () => {
                doc.actions.push(
                    {
                        type: 'Ban',
                        executorId: interaction.member.id,
                        createdTimestamp: Date.now(),
                        active: true,
                        time: time === '0' ? 0 : ms(time),
                        reason
                    }
                )
                await client.db.guildMembers.save(doc)
                await client.db.audits.sendCustomModLogger('GuildBanAdd', interaction.member, user, { reason, time }, interaction.guildLocale)
                
                return interaction.editReply({
                    embeds: [
                        client.storage.embeds.default(
                            interaction.member, client.db.guilds.getColor(interaction.guildId), `Бан участника`,
                            locale, `Вы **успешно** забанили ${user.toString()} на **${time}**${reason ? `, по причине: \`${reason}\`` : ''}`
                        )
                    ]
                })
            })
            .catch(() => {
                return interaction.editReply({
                    embeds: [
                        client.storage.embeds.default(
                            interaction.member, client.db.guilds.getColor(interaction.guildId), `Бан участника`,
                            locale, `Произошла ошибка! Я **не** смог забанить ${user.toString()}`
                        )
                    ]
                })
            })
        }

        if(target.user.bot) {
            return interaction.reply({ content: `${client.services.lang.get("на ботах юзать нельзя", locale)}`, ephemeral: true })
        }

        if(target.id === interaction.member.id) {
            return interaction.reply({ content: `${client.services.lang.get("на себе юзать нельзя", locale)}`, ephemeral: true })
        }

        await interaction.deferReply()

        const doc = await client.db.guildMembers.get(target)
        await target.ban({ reason })
        .then(async () => {
            doc.actions.push(
                {
                    type: 'Ban',
                    executorId: interaction.member.id,
                    createdTimestamp: Date.now(),
                    active: true,
                    time: time === '0' ? 0 : ms(time),
                    reason
                }
            )
            await client.db.guildMembers.save(doc)
            await client.db.audits.sendCustomModLogger('GuildBanAdd', interaction.member, target, { reason, time }, interaction.guildLocale)
            
            return interaction.editReply({
                embeds: [
                    client.storage.embeds.default(
                        interaction.member, client.db.guilds.getColor(interaction.guildId), `Бан участника`,
                        locale, `Вы **успешно** забанили ${target.toString()} на **${time}**${reason ? `, по причине: \`${reason}\`` : ''}`,
                        { indicateTitle: true, target }
                    )
                ]
            })
        })
        .catch(() => {
            return interaction.editReply({
                embeds: [
                    client.storage.embeds.default(
                        interaction.member, client.db.guilds.getColor(interaction.guildId), `Бан участника`,
                        locale, `Произошла ошибка! Я **не** смог забанить ${target.toString()}`,
                        { indicateTitle: true, target }
                    )
                ]
            })
        })
    }
)