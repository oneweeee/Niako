import { Body, Controller, Delete, Get, Headers, Post, Req } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import BaseController from "../../../struct/BaseController";

@ApiTags('User', 'Private Methods')
@Controller('private/user')
export class UserController extends BaseController {
    constructor(private readonly service: UserService) { super() }

    @Get('/id')
    async getId(@Req() req: Request, @Headers('authorization') token: string) {
        if(!token) {
            return this.sendError(401, { message: 'Unauthorized' })
        }

        const account = await this.service.getJwtToken(token)
        if(!account) {
            return this.sendError(401, { message: 'Invalid auth token' })
        }

        return this.sendSuccess({ message: 'Token is available', answer: account.id })
    }

    @Get('/token')
    async getToken(@Req() req: Request, @Headers('authorization') token: string) {
        if(!token) {
            return this.sendError(401, { message: 'Unauthorized' })
        }

        const account = await this.service.getJwtToken(token)
        if(!account) {
            return this.sendError(401, { message: 'Invalid auth token' })
        }
        
        /*if(account.expires_in && Date.now() > account.expires_in) {
            const res = await this.service.refresh(account)
            if(typeof res === 'string') {
                return this.sendError(500, { message: res })
            }

            return this.sendSuccess({ message: 'User is login', answer: res })
        }*/

        const discord = await this.service.getUserInfo(account.access_token)
        if(!discord || typeof discord === 'string') {
            return this.sendError(401, { message: 'Old auth token', answer: typeof discord === 'string' ? discord : 'No comments.' })
        }

        return this.sendSuccess({
            message: 'Token is available',
            answer: this.service.generateUserCookie(discord.db.jwt_token, discord.info)
        })
    }

    @Get('/guilds')
    async getServers(@Headers('authorization') token: string) {
        if(!token) {
            return this.sendError(401, { message: 'Unauthorized' })
        }

        const account = await this.service.getJwtToken(token)
        if(!account) {
            return this.sendError(401, { message: 'Invalid auth token' })
        }

        const guilds = await this.service.getGuilds(account)
        if(typeof guilds === 'string') {
            return this.sendError(401, { message: guilds })
        }

        return this.sendSuccess({ message: 'User guilds getting', answer: { userId: account.id, guilds } })
    }

    @Post('/auth')
    async post(@Body() body: { code: string, redirect_uri: string }) {
        if(!body?.code || !body?.redirect_uri) {
            return this.sendError(400, { message: 'No code and redirect_uri' })
        }

        const res = await this.service.authorization(body.code, body.redirect_uri)
        if(typeof res === 'string') {
            return this.sendError(500, { message: res })
        }

        return this.sendSuccess({ message: 'User is login', answer: res })
    }

    @Delete('/token')
    async deleteToken(@Headers('authorization') token: string, @Body() body: any) {
        if(!token) {
            return this.sendError(401, { message: 'Unauthorized' })
        }

        const account = await this.service.getJwtToken(token)
        if(!account) {
            return this.sendError(401, { message: 'Invalid auth token' })
        }

        await this.service.delete(token, body)

        return this.sendSuccess({ message: 'User account deleted...' })
    }
}