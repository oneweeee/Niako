import { ILoggerTypes } from "../../db/module_audit/ModuleAuditSchema";
import { NiakoClient } from "../client/NiakoClient";
import { ChannelType, Guild } from "discord.js";

type ICreateSendStates = 'Create' | 'Update' | 'Delete'

export default class LoggerManager {
    constructor(
        private client: NiakoClient
    ) {}

    async resolveChannel(guild: Guild, loggerType: ILoggerTypes) {
        const doc = await this.client.db.modules.audit.get(guild.id)
        if(!doc.state) return

        const getConfig = doc.channels.find((l) => l.types.includes(loggerType))
        if(!getConfig?.state) return

        const loggerChannel = guild.channels.cache.get(getConfig.channelId)
        if(!loggerChannel || loggerChannel.type !== ChannelType.GuildText) {
            const i = doc.channels.findIndex((l) => l.channelId === getConfig.channelId)
            doc.channels.splice(i, 1)
            await this.client.db.modules.audit.save(doc)
            return undefined
        }

        return loggerChannel
    }

    getEmbed(state: ICreateSendStates) {
        switch(state) {
            case 'Create':
                return this.client.storage.embeds.loggerGreen()
            case 'Delete':
                return this.client.storage.embeds.loggerRed()
            case 'Update':
                return this.client.storage.embeds.loggerYellow()
        }
    }
}