import BaseListener from "#base/BaseListener";
import {
    AuditLogEvent,
    GuildMember,
    TextChannel,
} from "discord.js";

export default new BaseListener(
    { name: 'guildMemberAdd' },
    async (client, member: GuildMember) => {
        const get = await client.db.raids.get(member.guild.id)
        const mainSetting = await client.db.guilds.get(member.guild.id, member.guild.preferredLocale)
        const res = await client.db.crashs.get(member.guild.id)
        const channel = await client.db.audits.resolveChannel(member.guild, ['GuildMemberAdd', 'GuildBotAdd'])
        const dbTarget = await client.db.guildMembers.get(member)
        if(dbTarget.actions.some((t) => t.active)) {
            const get = dbTarget.actions.find((t) => t.active)
            if(get) {
                switch(get.type) {
                    case 'Ban':
                        break
                    case 'Lockdown':
                        const crash = await client.db.crashs.get(member.guild.id)
                        if(member.guild.roles.cache.has(crash.banId)) {
                            await member.roles.add(crash.banId).catch(() => {})
                        }
                        break
                    default:
                        if(mainSetting.mutes.general?.roleId && get.type === 'GMute') {
                            await member.roles.add(mainSetting.mutes.general.roleId).catch(() => {})
                        }
                        
                        if(mainSetting.mutes.text?.roleId && get.type === 'TMute') {
                            await member.roles.remove(mainSetting.mutes.text.roleId).catch(() => {})
                        }
                    
                        if(mainSetting.mutes.voice?.roleId && get.type === 'VMute') {
                            await member.roles.remove(mainSetting.mutes.voice.roleId).catch(() => {})
                        }
                    
                        if((get.time !== 0 ? (Date.now() - (get.createdTimestamp + get.time)) > 0 : true) && get.type === 'Timeout') {
                            await member.timeout(Math.round(Date.now() - (get.createdTimestamp + get.time))).catch(() => {})
                        }
                        break        
                }
            }
        }

        if(get.status) {
            const filter = member.guild.members.cache.filter(m => m.joinedTimestamp! > Date.now()-get.timeJoin)

            const channel = member.guild.channels.cache.get(get.channelId)
    
            if(filter.size > get.memberCount) {
                if(get.push === 'Ban') {
                    return member.ban(
                        {
                            reason: `${client.user!.tag} | Защита сервера от нападения токенов (Anti-Raid)`
                        }
                    ).then(async () => {
                        if(channel) {
                            return (channel as TextChannel).send({
                                content: `Пользователь ${member.toString()} был **забанен** по причине "**Рейд**"`
                            })
                        }
                    }).catch(() => {})
                } else {
                    return member.kick(
                        `${client.user!.tag} | Защита сервера от нападения токенов (Anti-Raid)`
                    ).then(async () => {
                        if(channel) {
                            return (channel as TextChannel).send({
                                content: `Пользователь ${member.toString()} был **выгнан** по причине "**Рейд**".`
                            })
                        }
                    }).catch(() => {})
                }
            }
        }

        if(res.status) {
            if(member.user.bot) {
                await client.db.crashs.push(member.guild, res, AuditLogEvent.BotAdd, 'AddBot', { bot: member, guild: member.guild })
            }
        }

        if(mainSetting.autoRoles.length > 0 && !member.user.bot) {
            await client.util.addRoles(member, mainSetting.autoRoles)
        }

        if(channel) {
            if(channel.type === 'GuildMemberAdd' as any && member.user.bot) return
            if(channel.type === 'GuildBotAdd' as any && !member.user.bot) return

            const embed = client.storage.embeds.green()
            .setAuthor(
                {
                    name: (member.user.bot ? 'Бота добавили на сервер' : 'Пользователь зашёл на сервер'),
                    iconURL: client.icons[member.user.bot ? 'Bot' : 'Member']['Green']
                }
            )
            .setImage(client.icons['Guild']['Line'])
            .setThumbnail(client.util.getAvatar(member))
            
            .addFields(
                {
                    name: '> Дата входа:',
                    inline: false,
                    value: `・<t:${Math.round(Date.now() / 1000)}:F> \n・<t:${Math.round(Date.now() / 1000)}:R>`
                },
                {
                    name: `> ${client.db.audits.getMemberName(member.guild, member.user)}:`,
                    value: `・${member.toString()} \n・${member.user.tag} \n・${member.user.id}`,
                    inline: true
                },
                {
                    name: '> Дата создания аккаунта:',
                    inline: true,
                    value: `・<t:${Math.round(member.user.createdTimestamp / 1000)}:f> \n・<t:${Math.round(member.user.createdTimestamp / 1000)}:R>`
                }
            )

            if(member.user.bot) {
                const action = await client.db.audits.getAudit(member.guild, AuditLogEvent.BotAdd)
                if(action && action?.executor) {
                    embed.addFields(
                        {
                            name: '> Добавил:',
                            value: `・${action.executor.toString()} \n・${action.executor.tag} \n・${action.executor.id}`,
                            inline: false
                        }
                    )
                }
            }

            return channel.text.send({ embeds: [ embed ] }).catch(() => {})
        }
    }
)