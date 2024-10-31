import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseEvent from "../../../struct/base/BaseEvent";
import {
    AuditLogEvent,
    ChannelType,
    Collection,
    Role
} from "discord.js";

export default new BaseEvent(

    {
        name: 'roleDelete'
    },

    async (client: NiakoClient, role: Role) => {
        const doc = await client.db.modules.audit.get(role.guild.id)
        if(doc.state) {
            const getConfig = doc.types.find((l) => l.type === 'roleDelete')
            if(getConfig && getConfig.state) {
                const logger = role.guild.channels.cache.get(getConfig.channelId)
                if(logger && logger.type === ChannelType.GuildText) {
                    const embed = client.storage.embeds.loggerRed()
                    .setAuthor({ name: 'Удаление роли', iconURL: client.config.icons['Role']['Red'] })
                    .setFooter({ text: `Id роли: ${role.id}` })
                    .setTimestamp()

                    .addFields(
                        {
                            name: 'Роль',
                            inline: true,
                            value: `${role?.name || 'unknown role'}`
                        }
                    )

                    const action = (await role.guild.fetchAuditLogs({ limit: 1 }).catch(() => {}) || ({ entries: new Collection() })).entries.find((a) => a.action === AuditLogEvent.RoleDelete)
                    if(action && action?.executor) {
                        embed.addFields(
                            {
                                name: 'Удалил',
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