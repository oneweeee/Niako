import { ApplicationCommandOptionType } from "discord.js";
import BaseSlashCommand from "#base/BaseSlashCommand";
import ms from "ms";

export default new BaseSlashCommand(
    {
        name: 'lockdown',
        description: 'Lockdown',
        descriptionLocalizations: {
            'ru': 'Локдаун'
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

        if(target.roles.cache.has(res.banId)) {
            return interaction.reply({ content: `${client.services.lang.get("уже в карантине", locale)}`, ephemeral: true })
        }

        const reason = interaction.options.get('reason')?.value as string || undefined
        const time = (interaction.options.get('time', true)?.value as string | undefined) || '0s'

        if(time && !client.util.isActionTime(time)) {
            return interaction.reply({ content: `${client.services.lang.get("некорректное время", locale)}`, ephemeral: true })
        }

        await interaction.deferReply()

        const doc = await client.db.guildMembers.get(target)
        await target.roles.add(res.banId)
        .then(async () => {
            doc.actions.push(
                {
                    type: 'Lockdown',
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
                        interaction.member, client.db.guilds.getColor(interaction.guildId), `Карантин участника`,
                        locale, `Вы **успешно** выдали ${target.toString()} карантин на **${time}**${reason ? `, по причине: \`${reason}\`` : ''}`,
                        { indicateTitle: true, target }
                    )
                ]
            })
        })
        .catch(() => {
            return interaction.editReply({
                embeds: [
                    client.storage.embeds.default(
                        interaction.member, client.db.guilds.getColor(interaction.guildId), `Карантин участника`,
                        locale, `Произошла ошибка! Я **не** смог **выдать** карантин ${target.toString()}`,
                        { indicateTitle: true, target }
                    )
                ]
            })
        })
    }
)