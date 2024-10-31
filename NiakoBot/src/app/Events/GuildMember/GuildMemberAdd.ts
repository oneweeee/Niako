import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseEvent from "../../../struct/base/BaseEvent";
import {
    AuditLogEvent,
    ChannelType,
    Collection,
    GuildMember
} from "discord.js";

export default new BaseEvent(

    {
        name: 'guildMemberAdd'
    },

    async (client: NiakoClient, member: GuildMember) => {
        client.db.modules.banner.addUpdateGuild(member.guild.id)

        if(member.guild.id === client.config.meta.supportGuildId) {
            const badge = await client.db.badges.get(member.id, 'NiakoEarlySupport')
            if(badge) {
                await member.roles.add(client.config.roles.earlySupport).catch(() => {})
            }
        }

        const doc = await client.db.modules.audit.get(member.guild.id)
        if(doc.state) {
            let getConfig
            if(member.user.bot) {
                getConfig = doc.types.find((l) => l.type === 'guildBotAdd')
            } else {
                getConfig = doc.types.find((l) => l.type === 'guildMemberAdd')
            }

            if(getConfig && getConfig.state) {
                const channel = member.guild.channels.cache.get(getConfig.channelId)
                if(channel && channel.type === ChannelType.GuildText) {
                    const embed = client.storage.embeds.loggerGreen()
                    .setAuthor({ name: (member.user.bot ? 'Бота добавили на сервер' : 'Пользователь зашёл на сервер'), iconURL: client.config.icons[member.user.bot ? 'Bot' : 'Member']['Green'] })
                    .setFooter({ text: `Id ${member.user.bot ? 'бота' : 'пользователя'}: ${member.id}` })
                    .setThumbnail(client.util.getAvatar(member))
                    .setTimestamp()

                    .addFields(
                        {
                            name: client.db.modules.audit.getMemberName(member.guild, member.user),
                            value: `${member.toString()} | \`${member.user.tag}\``,
                            inline: true
                        }
                    )

                    if(member.user.bot) {
                        const action = (await member.guild.fetchAuditLogs({ limit: 1 }).catch(() => {}) || ({ entries: new Collection() })).entries.find((a) => a.action === AuditLogEvent.BotAdd)
                        if(action && action?.executor) {
                            embed.addFields(
                                {
                                    name: 'Добавил',
                                    value: `${action.executor.toString()} | \`${action.executor.tag}\``,
                                    inline: true
                                }
                            )
                        }
                    }

                    embed.addFields(
                        {
                            name: `Дата создания аккаунта`,
                            inline: false,
                            value: `<t:${Math.round(member.user.createdTimestamp / 1000)}:f>`
                        }
                    )

                    return channel.send({ embeds: [ embed ] }).catch(() => {})
                }
            }
        }
    }
)