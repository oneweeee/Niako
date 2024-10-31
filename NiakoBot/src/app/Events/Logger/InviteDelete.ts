import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseEvent from "../../../struct/base/BaseEvent";
import {
    AuditLogEvent,
    ChannelType,
    Collection,
    Guild,
    Invite
} from "discord.js";

export default new BaseEvent(

    {
        name: 'inviteDelete'
    },

    async (client: NiakoClient, invite: Invite) => {
        if(!invite?.guild) return
        
        const doc = await client.db.modules.audit.get(invite.guild.id)
        if(doc.state) {
            const getConfig = doc.types.find((l) => l.type === 'inviteDelete')
            if(getConfig && getConfig.state) {
                const logger = (invite.guild as Guild).channels.cache.get(getConfig.channelId)
                if(logger && logger.type === ChannelType.GuildText) {
                    const embed = client.storage.embeds.loggerRed()
                    .setAuthor({ name: 'Удаление приглашения', iconURL: client.config.icons['Invite']['Red'] })
                    .setTimestamp()

                    .addFields(
                        {
                            name: 'Ссылка',
                            inline: true,
                            value: `[Перейти](https://discord.gg/${invite.code}) | \`${invite.code}\``
                        }
                    )

                    const action = (await (invite.guild as Guild).fetchAuditLogs({ limit: 1 }).catch(() => {}) || ({ entries: new Collection() })).entries.find((a) => a.action === AuditLogEvent.InviteDelete)
                    if(action && action?.executor) {
                        embed.addFields(
                            {
                                name: 'Удалил',
                                value: `${action.executor.toString()} | \`${action.executor.tag}\``,
                                inline: true
                            }
                        )
                        .setFooter({ text: `Id пользователя: ${action.executor.id}` })
                    }

                    return logger.send({ embeds: [ embed ] }).catch(() => {})
                }
            }
        }
    }
)