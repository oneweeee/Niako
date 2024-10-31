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
        name: 'roleCreate'
    },

    async (client: NiakoClient, role: Role) => {
        const doc = await client.db.modules.audit.get(role.guild.id)
        if(doc.state) {
            const getConfig = doc.types.find((l) => l.type === 'roleCreate')
            if(getConfig && getConfig.state) {
                const logger = role.guild.channels.cache.get(getConfig.channelId)
                if(logger && logger.type === ChannelType.GuildText) {
                    const embed = client.storage.embeds.loggerGreen()
                    .setAuthor({ name: 'Создание роли', iconURL: client.config.icons['Role']['Green'] })
                    .setFooter({ text: `Id роли: ${role.id}` })
                    .setTimestamp()

                    .addFields(
                        {
                            name: 'Роль',
                            inline: true,
                            value: `${role.toString()} | \`${role.name}\``
                        }
                    )

                    const action = (await role.guild.fetchAuditLogs({ limit: 1 }).catch(() => {}) || ({ entries: new Collection() })).entries.find((a) => a.action === AuditLogEvent.RoleCreate)
                    if(action && action?.executor) {
                        embed.addFields(
                            {
                                name: 'Создал',
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