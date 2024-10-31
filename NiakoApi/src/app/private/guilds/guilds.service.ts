import { ChannelType, Client, EmbedBuilder } from "discord.js";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { IModuleBannerDto, ModuleBanner } from "./dto/module_banner.dto";
import { IModuleVoiceDto, ModuleVoice } from "./dto/module_voice.dto";
import { IModuleAuditDto, ModuleAudit } from "./dto/module_audit.dto";
import { Badge, IBadgeDto } from "./dto/badges.dto";
import { IBoostDto, Boost } from "./dto/boosts.dto";
import BaseService from "../../../struct/BaseService";
import { WebSocket } from "ws";

@Injectable()
export class GuildsService extends BaseService {
    public ids: string[] = []

    constructor(
        @InjectModel(ModuleBanner.name) private moduleBanner: Model<IModuleBannerDto>,
        @InjectModel(ModuleVoice.name) private moduleVoice: Model<IModuleVoiceDto>,
        @InjectModel(ModuleAudit.name) private moduleAudit: Model<IModuleAuditDto>,
        @InjectModel(Badge.name) private badges: Model<IBadgeDto>,
        @InjectModel(Boost.name) private boosts: Model<IBoostDto>,
        private readonly client: Client
    ) { super() }

    getIds() {
        return this.ids
    }

    postGuilds(ids: string[]) {
        for ( let i = 0; ids.length > i; i++ ) {
            if(!this.ids.includes(ids[i])) {
                this.ids.push(ids[i])
            }
        }
    }

    async addId(guildId: string) {
        /*const channel = this.getChannel()
        if(channel) {
            const embed = new EmbedBuilder()

            if(guildData?.icon) {
                if((guildData.icon as string).startsWith('a_')) {
                    embed.setThumbnail(`https://cdn.discordapp.com/icons/${guildData.id}/${guildData.icon}.gif?size=4096`)
                } else {
                    embed.setThumbnail(`https://cdn.discordapp.com/icons/${guildData.id}/${guildData.icon}.png?size=4096`)
                }
            }

            await channel.send({
                embeds: [
                    embed.setColor(0x28C76F).setTimestamp(guildData?.createdTimestamp || Date.now())
                    .addFields(
                        { name: `Владелец`, value: `<@!${guildData?.ownerId}>`, inline: true },
                        { name: `Участников`, value: `${guildData?.memberCount}`, inline: true }
                    )
                    .setAuthor({ name: `Добавлена на сервер ${guildData.name}`, iconURL: 'https://cdn.discordapp.com/emojis/1098190090116812850.png?size=4096' })
                    .setFooter({ text: `Id сервера: ${guildData.id}`})
                ]
            })
        }*/

        if(!this.ids.includes(guildId)) {
            this.ids.push(guildId)
        }
    }

    async removeId(guildId: string) {
        /*const channel = this.getChannel()
        if(channel) {
            const embed = new EmbedBuilder()

            if(guildData?.icon) {
                if((guildData.icon as string).startsWith('a_')) {
                    embed.setThumbnail(`https://cdn.discordapp.com/icons/${guildData.id}/${guildData.icon}.gif?size=4096`)
                } else {
                    embed.setThumbnail(`https://cdn.discordapp.com/icons/${guildData.id}/${guildData.icon}.png?size=4096`)
                }
            }

            await channel.send({
                embeds: [
                    embed.setColor(0xEA5455).setTimestamp(guildData?.createdTimestamp || Date.now())
                    .addFields(
                        { name: `Владелец`, value: `<@!${guildData?.ownerId}>`, inline: true },
                        { name: `Участников`, value: `${guildData?.memberCount}`, inline: true }
                    )
                    .setAuthor({ name: `Выгнана с сервера ${guildData.name}`, iconURL: 'https://cdn.discordapp.com/emojis/1098190093111537694.png?size=4096' })
                    .setFooter({ text: `Id сервера: ${guildData.id}`})
                ]
            })
        }*/

        if(this.ids.includes(guildId)) {
            this.ids.splice(this.ids.indexOf(guildId), 1)
        }
    }

    async getGuildAccess(token: string, guildId: string) {
        const res = await fetch(
            `${this.config.apiUrl}/private/user/guilds`,
            {
                headers: {
                    Authorization: token
                }
            }
        ).then(async (res) => await res.json())

        if(!res?.status) return res.message

        return { userId: res.answer.userId, access: (await this.getDiscordAccess(token) || res.answer.guilds.map((g) => g.id).includes(guildId)) }
    }

    async getGuildInfo(guildId: string) {
        const res = await fetch(
            `https://discordapp.com/api/guilds/${guildId}`,
            {
                headers: {
                    Authorization: `Bot ${this.config.clientToken}`
                }
            }
        ).then(async (res) => await res.json())

        return res
    }

    async getGuildChannels(guildId: string) {
        const res = await fetch(
            `https://discordapp.com/api/guilds/${guildId}/channels`,
            {
                headers: {
                    Authorization: `Bot ${this.config.clientToken}`
                }
            }
        ).then(async (res) => await res.json())

        return res
    }

    async getGuildThreads(guildId: string) {
        const res = await fetch(
            `https://discordapp.com/api/guilds/${guildId}/threads/active`,
            {
                headers: {
                    Authorization: `Bot ${this.config.clientToken}`
                }
            }
        ).then(async (res) => await res.json())

        return (res?.threads?.length ? res.threads : [])
    }

    async getGuildMember(guildId: string, userId: string) {
        const res = await fetch(
            `https://discordapp.com/api/guilds/${guildId}/members/${userId}`,
            {
                headers: {
                    Authorization: `Bot ${this.config.clientToken}`
                }
            }
        ).then(async (res) => await res.json())

        return res
    }

    async getGuildWebhooks(guildId: string) {
        const res = await fetch(
            `https://discordapp.com/api/guilds/${guildId}/webhooks`,
            {
                headers: {
                    Authorization: `Bot ${this.config.clientToken}`
                }
            }
        ).then(async (res) => await res.json())

        return res
    }

    async getConfigBanner(guildId: string) {
        return (await this.moduleBanner.findOne({ guildId }) ?? await this.createModuleBanner(guildId))
    }

    async putConfigBanner(req: IModuleBannerDto) {
        const config = await this.getConfigBanner(req.guildId)
        const confines = this.getBoostConfines((await this.findPremium(req.guildId)).count)
        
        config.timezone = (req?.timezone ? req.timezone : config.timezone)
        config.background = (req?.background ? req.background : config.background)
        config.type = (req?.type ? ['Normal', 'Compressed'].includes(req.type) ? req.type : 'Compressed' : config.type)
        config.activeType = (req?.activeType ? ['Online', 'Message'].includes(req.activeType) ? req.activeType : 'Online' : config.activeType)
        config.state = (req?.state || false)
        config.backgrounds = (req?.backgrounds || config.backgrounds)
        config.updated = (req?.updated ? (confines.updated.includes(req.updated) ? req.updated : '5m') : '5m')
        config.activeUserUpdated = (
            req?.activeUserUpdated &&
            (
                req.activeUserUpdated.endsWith('m') || 
                req.activeUserUpdated.endsWith('h') ||
                req.activeUserUpdated.endsWith('d')
            ) ? req.activeUserUpdated : config.activeUserUpdated
        )
        config.activeUserStatus = (req?.activeUserStatus && req.activeUserStatus.length > 0 ? req.activeUserStatus : config.activeUserStatus)
        config.items = (req?.items && typeof req?.items === 'object' ? req?.items.filter((i: Object) => typeof i === 'object' && i.hasOwnProperty('type') && i.hasOwnProperty('x') && i.hasOwnProperty('y')) : config.items)
        await config.save()

        const ws = new WebSocket('ws://localhost:3331')

        ws.on('open', () => {
            ws.send(JSON.stringify({ method: 'banner', guildId: config.guildId }))
            ws.close()
        })

        return config
    }

    async putConfigRoom(req: IModuleVoiceDto) {
        const config = await this.getConfigVoice(req.guildId)

        let webhookEdit: boolean = false
        let defaultConfig: boolean = false
        if(req?.webhook?.avatar && req.webhook.avatar !== config.webhook.avatar) {
            config.webhook.avatar = req.webhook.avatar
            webhookEdit = true
        }
        
        if(req?.webhook?.username && req.webhook.username !== config.webhook.username) {
            config.webhook.username = req.webhook.username
            webhookEdit = true
        }

        if(req?.buttons && typeof req?.buttons === 'object') {
            config.buttons = req.buttons
        }

        if(req?.defaultBlockRoles && typeof req?.defaultBlockRoles === 'object' && req?.defaultBlockRoles?.length) {
            config.defaultBlockRoles = req.defaultBlockRoles
        }

        if(req?.type && req.type !== config.type) {
            config.type = req.type
        }

        if(req?.embed && req.embed !== config.embed) {
            config.embed = req.embed
        }

        if(req?.default?.roomName && req.default.roomName !== config.default.roomName) {
            defaultConfig = true
            config.default.roomName = req.default.roomName
        }

        if(req?.color && req.color !== config.color) {
            config.color = req.color
        }

        if(typeof req?.default?.roomLimit === 'number' && req.default.roomLimit !== config.default.roomLimit) {
            defaultConfig = true
            config.default.roomLimit = req.default.roomLimit
        }

        config.game = (req?.game || false)
        config.transferRoomAtOwnerLeave = (req?.transferRoomAtOwnerLeave || false)
        config.sendMessageInRoom = (req?.sendMessageInRoom || false)
        config.noDeleteCreatedChannel = (req?.noDeleteCreatedChannel || false)

        if(webhookEdit) {
            config.markModified('webhook')
        }

        if(defaultConfig) {
            config.markModified('default')
        }

        config.markModified('buttons')
        await config.save()

        const ws = new WebSocket('ws://localhost:3331')

        ws.on('open', () => {
            ws.send(JSON.stringify({ method: 'sendRoomMessage', webhookEdit, guildId: config.guildId }))
            ws.close()
        })

        return config
    }

    async putConfigAudit(req: IModuleAuditDto) {
        const config = await this.getConfigAudit(req.guildId)

        config.state = (req?.state || false)
        if(req?.types && typeof req?.types === 'object') {
            config.types = req.types
            config.markModified('types')
        }

        await config.save()

        const ws = new WebSocket('ws://localhost:3331')

        ws.on('open', () => {
            ws.send(JSON.stringify({ method: 'putModuleAudit', guildId: config.guildId }))
            ws.close()
        })

        return config
    }

    async createConfigRoom(guildId: string) {
        const config = await this.getConfigVoice(guildId)
        if(config.state) return

        const ws = new WebSocket('ws://localhost:3331')

        ws.on('open', () => {
            ws.send(JSON.stringify({ method: 'createPrivateVoice', guildId: config.guildId }))
            ws.close()
        })

        return config
    }
    
    async deleteConfigRoom(guildId: string) {
        const config = await this.getConfigVoice(guildId)

        config.state = false
        await config.save()

        const ws = new WebSocket('ws://localhost:3331')

        ws.on('open', () => {
            ws.send(JSON.stringify({ method: 'deletePrivateVoice', guildId: config.guildId }))
            ws.close()
        })

        return config
    }

    sendWebhook(guildId: string, body: any) {
        const ws = new WebSocket('ws://localhost:3331')

        ws.on('open', () => {
            ws.send(JSON.stringify({ method: 'actionEmbedBuilder',  ...body, guildId }))
            ws.close()
        })

        return
    }

    getBoostConfines(boostCount: number) {
        switch(boostCount) {
            case 0:
            case 1:
                return { updated: [ '5m' ] }
            case 2:
            case 3:
            case 4:
                return { updated: [ '5m', '4m', '3m' ] }
            case 5:
            case 6:
                return { updated: [ '5m', '4m', '3m', '2m' ] }
            default:
                return { updated: [ '5m', '4m', '3m', '2m', '1m' ] }
        }
    }

    async getConfigVoice(guildId: string) {
        return (await this.moduleVoice.findOne({ guildId }) ?? await this.createModuleVoice(guildId))
    }

    async getConfigAudit(guildId: string) {
        return (await this.moduleAudit.findOne({ guildId }) ?? await this.createModuleAudit(guildId))
    }

    async findGuildBoosts(guildId: string) {
        return (await this.boosts.find({ guildId }))
    }

    async findPremium(guildId: string) {
        const boosts = (await this.boosts.find({ guildId }))
        const badge = (await this.badges.find({ guildId })).map((b) => b.badge)
        const has = badge.includes('NiakoPartner') || boosts.length > 0
        return { has, count: badge.includes('NiakoPartner') ? 100 : boosts.length }
    }

    private async createModuleBanner(guildId: string) {
        const doc = await this.moduleBanner.create({ guildId })
        return (await doc.save())
    }

    private async createModuleVoice(guildId: string) {
        const doc = await this.moduleVoice.create({ guildId })
        return (await doc.save())
    }

    private async createModuleAudit(guildId: string) {
        const doc = await this.moduleAudit.create({ guildId })
        return (await doc.save())
    }

    private getChannel() {
        const guild = this.client.guilds.cache.get(this.config.guildId)
        if(!guild) return null

        const channel = guild.channels.cache.get(this.config.channels.guilds)
        if(!channel || channel?.type !== ChannelType.GuildText) return null

        return channel
    }

    private async getDiscordAccess(token: string) {
        const res = await await fetch(`${this.config.apiUrl}/private/user/id`, {
            headers: { Authorization: token }
        }).then(async (res) => await res.json()).catch(() => null)

        if(!res) return false

        const guild = this.client.guilds.cache.get(this.config.guildId)
        if(!guild) return false

        const member = guild.members.cache.get(res.answer)
        if(!member) return false

        return member.roles.cache.some((r) => this.config.accessRoles.includes(r.id))
    }
}