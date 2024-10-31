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
        name: 'guildMemberRemove'
    },

    async (client: NiakoClient, member: GuildMember) => {
        if(member.guild.id === client.config.meta.supportGuildId) {
            await client.db.boosts.removeBoosts(member.id)
        }
        
        client.db.modules.banner.addUpdateGuild(member.guild.id)
        
        const doc = await client.db.modules.audit.get(member.guild.id)
        if(doc.state) {
            let getConfig
            if(member.user.bot) {
                getConfig = doc.types.find((l) => l.type === 'guildBotRemove')
            } else {
                getConfig = doc.types.find((l) => l.type === 'guildMemberRemove')
            }

            if(getConfig && getConfig.state) {
                const channel = member.guild.channels.cache.get(getConfig.channelId)
                if(channel && channel.type === ChannelType.GuildText) {
                    const embed = client.storage.embeds.loggerRed()
                    .setAuthor({ name: (member.user.bot ? 'Бота выгнали с сервера' : 'Пользователь вышел с сервера'), iconURL: client.config.icons[member.user.bot ? 'Bot' : 'Member']['Red'] })
                    .setFooter({ text: `Id ${member.user.bot ? 'бота' : 'пользователя'}: ${member.id}` })
                    .setThumbnail(client.util.getAvatar(member))
                    .setTimestamp(member.user.createdTimestamp)

                    .addFields(
                        {
                            name: client.db.modules.audit.getMemberName(member.guild, member.user),
                            value: `${member.toString()} | \`${member.user.tag}\``,
                            inline: true
                        }
                    )

                    if(member.user.bot) {
                        const action = (await member.guild.fetchAuditLogs({ limit: 1 }).catch(() => {}) || ({ entries: new Collection() })).entries.find((a) => a.action === AuditLogEvent.MemberKick)
                        if(action && action?.executor) {
                            embed.addFields(
                                {
                                    name: 'Выгнал',
                                    value: `${action.executor.toString()} | \`${action.executor.tag}\``,
                                    inline: true
                                }
                            )
                        }
                    }

                    embed.addFields(
                        {
                            name: member.joinedTimestamp ? `Дата входа на сервер` : 'Дата создания аккаунта',
                            inline: false,
                            value: member.joinedTimestamp ? `<t:${Math.round(member.joinedTimestamp / 1000)}:f>` : `<t:${Math.round(member.user.createdTimestamp / 1000)}:f>`
                        }
                    )

                    return channel.send({ embeds: [ embed ] }).catch(() => {})
                }
            }
        }
    }
)