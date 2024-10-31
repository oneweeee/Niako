import { Controller, Delete, Get, Post, Put, Req } from "@nestjs/common";
import { GuildsService } from "./guilds.service";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import BaseController from "../../../struct/BaseController";

@ApiTags('Guild', 'Private Methods')
@Controller('private/guilds')
export class GuildsController extends BaseController {
    constructor(private readonly service: GuildsService) { super() }

    @Get()
    async getIds(@Req() req: Request) {
        const checkAuth = this.checkAuth(req)
        if(checkAuth) return checkAuth

        return this.sendSuccess({ message: 'Guilds is getting', answer: this.service.getIds() })
    }

    @Get(':id')
    async getGuild(@Req() req: Request) {
        const token = req.headers?.authorization
        if(!token) {
            return this.sendError(401, { message: 'Unauthorized' })
        }

        const guildId = req.params?.id
        if(!guildId) {
            return this.sendSuccess({ answer: 'No guildId' })
        }

        const checkAccess = await this.service.getGuildAccess(token, guildId)
        if(typeof checkAccess === 'string' || !checkAccess?.access) {
            return this.sendError(403, { message: 'Forbidden' })
        }

        return this.sendSuccess({ message: 'Access defined' })
    }

    @Get(':id/info')
    async getDiscordGuild(@Req() req: Request) {
        const token = req.headers.authorization
        if(!token) {
            return this.sendError(401, { message: 'Unauthorized' })
        }

        const guildId = req.params?.id
        if(!guildId) {
            return this.sendSuccess({ answer: 'No guildId' })
        }

        const checkAccess = await this.service.getGuildAccess(token, guildId)
        if(typeof checkAccess === 'string' || !checkAccess?.access) {
            return this.sendError(403, { message: 'Forbidden' })
        }

        const getDiscordInfoGuild = await this.service.getGuildInfo(guildId)
        const channels = await this.service.getGuildChannels(guildId)
        const threads = await this.service.getGuildThreads(guildId)
        const webhooks = await this.service.getGuildWebhooks(guildId)

        return this.sendSuccess({ message: 'Access defined', answer: { ...getDiscordInfoGuild, channels: [ ...channels, ...threads ], webhooks } })
    }


    @Get(':id/banner')
    async getConfigBanner(@Req() req: Request) {
        const access = await this.getGuild(req)
        if(access.code !== 200) {
            return this.sendError(403, { message: 'Forbidden' })
        }

        const moduleBanner = await this.service.getConfigBanner(req.params.id)

        return this.sendSuccess({ message: 'Success get config banner', answer: moduleBanner })
    }

    @Put(':id/banner')
    async putConfigBanner(@Req() req: Request) {
        const access = await this.getGuild(req)
        if(access.code !== 200) {
            return this.sendError(403, { message: 'Forbidden' })
        }

        const res = req.body
        if(!res?.guildId) {
            return this.sendError(400, { message: 'Body no have guildId' })
        }

        const putModuleBanner = await this.service.putConfigBanner(res)

        return this.sendSuccess({ message: 'Success put config banner', answer: putModuleBanner })
    }

    @Get(':id/voice')
    async getConfigVoice(@Req() req: Request) {
        const access = await this.getGuild(req)
        if(access.code !== 200) {
            return this.sendError(403, { message: 'Forbidden' })
        }

        const moduleVoice = await this.service.getConfigVoice(req.params.id)

        return this.sendSuccess({ message: 'Success get config voice', answer: moduleVoice })
    }

    @Post(':id/voice')
    async postConfigVoice(@Req() req: Request) {
        const access = await this.getGuild(req)
        if(access.code !== 200) {
            return this.sendError(403, { message: 'Forbidden' })
        }

        const moduleVoice = await this.service.createConfigRoom(req.params.id)

        return this.sendSuccess({ message: 'Success create config voice', answer: moduleVoice })
    }

    @Put(':id/voice')
    async putConfigVoice(@Req() req: Request) {
        const access = await this.getGuild(req)
        if(access.code !== 200) {
            return this.sendError(403, { message: 'Forbidden' })
        }

        const res = req.body
        if(!res?.guildId) {
            return this.sendError(400, { message: 'Body no have guildId' })
        }

        const putModuleVoice = await this.service.putConfigRoom(res)

        return this.sendSuccess({ message: 'Success put config voice', answer: putModuleVoice })
    }

    @Delete(':id/voice')
    async deleteConfigVoice(@Req() req: Request) {
        const access = await this.getGuild(req)
        if(access.code !== 200) {
            return this.sendError(403, { message: 'Forbidden' })
        }

        const moduleVoice = await this.service.deleteConfigRoom(req.params.id)

        return this.sendSuccess({ message: 'Success delete config voice', answer: moduleVoice })
    }

    @Get(':id/audit')
    async getConfigAudit(@Req() req: Request) {
        const access = await this.getGuild(req)
        if(access.code !== 200) {
            return this.sendError(403, { message: 'Forbidden' })
        }

        const moduleAudit = await this.service.getConfigAudit(req.params.id)

        return this.sendSuccess({ message: 'Success get config audit', answer: moduleAudit })
    }

    @Put(':id/audit')
    async putConfigAudit(@Req() req: Request) {
        const access = await this.getGuild(req)
        if(access.code !== 200) {
            return this.sendError(403, { message: 'Forbidden' })
        }

        const res = req.body
        if(!res?.guildId) {
            return this.sendError(400, { message: 'Body no have guildId' })
        }

        const putModuleAudit = await this.service.putConfigAudit(res)

        return this.sendSuccess({ message: 'Success put config audit', answer: putModuleAudit })
    }

    @Post(':id/builder')
    async postEmbedBuilder(@Req() req: Request) {
        const access = await this.getGuild(req)
        if(access.code !== 200) {
            return this.sendError(403, { message: 'Forbidden' })
        }

        this.service.sendWebhook(req.params.id, req.body)

        return this.sendSuccess({ message: 'Success send message', answer: true })
    }

    @Get(':id/webhooks')
    async getGuildWebhooks(@Req() req: Request) {
        const access = await this.getGuild(req)
        if(access.code !== 200) {
            return this.sendError(403, { message: 'Forbidden' })
        }

        const webhooks = await this.service.getGuildWebhooks(req.params.id)

        return this.sendSuccess({ message: 'Success get config audit', answer: webhooks })
    }

    @Get(':id/channels')
    async getGuildChannels(@Req() req: Request) {
        const access = await this.getGuild(req)
        if(access.code !== 200) {
            return this.sendError(403, { message: 'Forbidden' })
        }

        const channels = await this.service.getGuildChannels(req.params.id)
        const threads = await this.service.getGuildThreads(req.params.id)

        return this.sendSuccess({ message: 'Success get config audit', answer: [ ...channels, ...threads ] })
    }

    @Get(':id/boosts')
    async getConfigBoosts(@Req() req: Request) {
        const config = await this.service.findGuildBoosts(req.params.id)
        return this.sendSuccess({ message: 'Success get premium boost stars', answer: config })
    }

    @Get(':id/premium')
    async getPremium(@Req() req: Request) {
        const config = await this.service.findPremium(req.params.id)
        return this.sendSuccess({ message: 'Success get premium', answer: config })
    }

    @Post()
    async postGuilds(@Req() req: Request) {
        const checkAuth = this.checkAuth(req)
        if(checkAuth) return checkAuth

        const ids = req.body
        if(!ids || typeof ids !== 'object') return

        this.service.postGuilds(ids)

        return this.sendSuccess({ message: 'Guilds added in array' })
    }

    @Put('add')
    async addGuild(@Req() req: Request) {
        const checkAuth = this.checkAuth(req)
        if(checkAuth) return checkAuth

        await this.service.addId(req.body.id)

        return this.sendSuccess({ message: 'Guild added in array' })
    }

    @Put('remove')
    async removeGuild(@Req() req: Request) {
        const checkAuth = this.checkAuth(req)
        if(checkAuth) return checkAuth

        await this.service.removeId(req.body.id)

        return this.sendSuccess({ message: 'Guild removed from array' })
    }
}