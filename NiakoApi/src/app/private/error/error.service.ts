import { Injectable } from "@nestjs/common";
import { TextChannel, ThreadChannel, Client, EmbedBuilder } from "discord.js";
import BaseService from "../../../struct/BaseService";

@Injectable()
export class ErrorService extends BaseService {
    constructor(
        private readonly client: Client
    ) { super() }

    
    async send(error: any) {
        const channel = this.getChannel()
        if(channel) {
            const util = require('util')

            return channel.send({
                content: `<t:${Math.round(Date.now() / 1000)}:f>`,
                embeds: [
                    new EmbedBuilder().setColor(0x2b2d31)
                    .setTitle(error?.name || 'Неизвсетная ошибка')
                    .setDescription(`\`\`\`\n${util.inspect(error)}\n\`\`\``)
                ]
            })
        }
    }

    private getChannel() {
        const guild = this.client.guilds.cache.get(this.config.guildId)
        if(!guild) return null

        const channel = guild.channels.cache.get(this.config.channels.errors)
        if(!channel) return null

        if (channel instanceof TextChannel || channel instanceof ThreadChannel) {
        return channel
        }

        return null
    }
}