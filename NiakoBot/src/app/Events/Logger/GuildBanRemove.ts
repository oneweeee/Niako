import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseEvent from "../../../struct/base/BaseEvent";
import {
    AuditLogEvent,
    ChannelType,
    Collection,
    GuildBan
} from "discord.js";

export default new BaseEvent(

    {
        name: 'guildBanRemove'
    },

    async (client: NiakoClient, ban: GuildBan) => {
        const doc = await client.db.modules.audit.get(ban.guild.id)
        if(doc.state) {
            const getConfig = doc.types.find((l) => l.type === 'guildBanRemove')
            if(getConfig && getConfig.state) {
                const logger = ban.guild.channels.cache.get(getConfig.channelId)
                if(logger && logger.type === ChannelType.GuildText) {
                    const embed = client.storage.embeds.loggerGreen()
                    .setAuthor({ name: ban.user.bot ? 'Бот разблокирован' : 'Пользователь разблокирован', iconURL: client.config.icons['Member']['Green'] })
                    .setFooter({ text: `Id ${ban.user.bot?'бота':'пользователя'}: ${ban.user.id}` })
                    .setTimestamp()
                    .addFields(
                        {
                            name: client.db.modules.audit.getMemberName(ban.guild, ban.user),
                            inline: true,
                            value: `${ban.user.toString()} | \`${ban.user.tag}\``
                        }
                    )

                    const action = (await ban.guild.fetchAuditLogs({ limit: 1 }).catch(() => {}) || ({ entries: new Collection() })).entries.find((a) => a.action === AuditLogEvent.MemberBanRemove)
                    if(action && action?.executor) {
                        embed.addFields(
                            {
                                name: 'Разблокировал',
                                value: `${action.executor.toString()} | \`${action.executor.tag}\``,
                                inline: true
                            }
                        )
                    }

                    return logger.send({ embeds: [ embed ] }).catch(() => {})
                }
            }
        }
    }
)