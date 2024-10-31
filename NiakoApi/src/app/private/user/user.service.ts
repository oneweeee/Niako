import { TextChannel, ThreadChannel, ChannelType, Client } from "discord.js";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { IAuthDto, TAuthDocument } from "../../../types/private/auth";
import { Auth } from "./dto/auth.dto";
import BaseService from "../../../struct/BaseService";
import fetch from 'node-fetch';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService extends BaseService {
    constructor(
        @InjectModel(Auth.name) private db: Model<IAuthDto>,
        private readonly client: Client
    ) { super() }

    async getJwtToken(jwt_token: string) {
        return (await this.db.findOne({ jwt_token }))
    }

    async refresh(account: TAuthDocument) {
        const res = await fetch(
            'https://discord.com/api/oauth2/token/revoke',
            {
                method: 'Post',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    'client_id': this.config.clientId,
                    'client_secret': this.config.clientSecret,
                    'token': account.refresh_token,
                })
            }
        ).then(async (res) => await res.json())

        if(!res?.access_token) {
            return (res?.client_id || res?.redirect_uri ? 'Invalid code or redirect_uri' : (res.error || 'unknown error'))
        }

        account.access_token = res.access_token
        account.refresh_token = res.refresh_token
        account.expires_in = Math.trunc(Date.now() + res.expires_in)
        await account.save()

        const data = await this.getUserInfo(account.access_token)

        return this.generateUserCookie(data.db.jwt_token, data.info)
    }
    
    async authorization(code: string, redirect_uri: string) {
        const res = await fetch(
            'https://discordapp.com/api/oauth2/token',
            {
                method: 'Post',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    'client_id': this.config.clientId,
                    'client_secret': this.config.clientSecret,
                    'grant_type': 'authorization_code',
                    'code': code,
                    'redirect_uri': redirect_uri,
                    'scope': 'identify'
                })
            }
        ).then(async (res) => await res.json())

        if(!res?.access_token) {
            return (res?.client_id || res?.redirect_uri ? 'Invalid code or redirect_uri' : res.error)
        }

        const account = await this.getUserInfo(res.access_token)
        if(!account?.info || !account?.db) return account

        let update = false

        if(account.db.refresh_token === 'None') {
            update = true
            account.db.refresh_token = res.refresh_token
            account.db.expires_in = Math.trunc(Date.now() + res.expires_in)
        }

        if(account.db.jwt_token === 'None') {
            update = true
            account.db.jwt_token = this.createJwtToken(account.db)
        }

        if(update) {
            await account.db.save()
        }

        const channel = this.getChannel()
        if(channel) {
            await channel.send({ content: `${account?.firstLogin ? '[<:NK_StatusConnect:1188148383437824110>]' : '[<:NK_StatusRestart:1188159120914788434>]'} <@${account.info?.id}> | \`${account.info?.username}\` зашёл(-ла)` })
        }

        return this.generateUserCookie(account.db.jwt_token, account.info)
    }

    async getUserInfo(access_token: string) {
        const res = await fetch(
            'https://discord.com/api/users/@me',
            {
                headers: {
                    authorization: `Bearer ${access_token}`
                }
            }
        ).then(async (res) => await res.json()).catch(() => ({}))


        if(res?.error || res?.message) return (res?.error || res?.message)

        const get = await this.db.findOne({ id: res.id })
        if(get) {
            get.access_token = access_token
            return { info: res, db: (await get.save()), firstLogin: false }
        } else {
            const doc = await this.db.create({ id: res.id, access_token: access_token })
            return { info: res, db: (await doc.save()), firstLogin: true }
        }
    }

    async delete(jwt_token: string, res: any) {
        const channel = this.getChannel()
        if(channel) {
            await channel.send({ content: `[<:NK_StatusError:1188149028903460966>] <@${res?.id || '0'}> | \`${res?.username || 'unknown'}\` вышел(-ла)` })
        }

        return (await this.db.deleteOne({ jwt_token }))
    }

    async getGuilds(account: IAuthDto): Promise<string | any[]> {
        const memberGuilds = await this.fetchUserGuilds(account.access_token)
        if(memberGuilds?.code || memberGuilds?.message) return (memberGuilds?.error || memberGuilds?.message || 'Unknown user guilds')

        const botGuilds = await this.fetchBotGuilds()
        if(botGuilds?.code !== 200) return botGuilds.message

        return memberGuilds.filter(
            (g) => g.owner || this.getDiscordAccess(account.id) || g.permissions === 2147483647
        ).map((g) => ({ ...g, has: botGuilds.answer.includes(g.id) }))
    }

    private async fetchUserGuilds(access_token: string) {
        const answer = await fetch(
            'https://discordapp.com/api/users/@me/guilds',
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        ).then(async (res) => await res.json())

        return answer
    }

    private async fetchBotGuilds() {
        const answer = await fetch(
            `${this.config.apiUrl}/private/guilds`,
            {
                headers: {
                    Authorization: this.config.password
                }
            }
        ).then(async (res) => await res.json())

        return answer
    }

    private createJwtToken(doc: IAuthDto) {
        const token = jwt.sign(
            {
                "userId": doc.id,
                "createdTimestamp": Date.now(),
                "message": "Where are we going? Leave like a human being",
            },
            doc.access_token
        )

        return token
    }

    generateUserCookie(token: string, info: any) {
        return { ...info, token }
    }

    private getChannel() {
        const guild = this.client.guilds.cache.get(this.config.guildId)
        if(!guild) return null

        const channel = guild.channels.cache.get(this.config.channels.auth)
        if(!channel) return null

        if (channel instanceof TextChannel || channel instanceof ThreadChannel) {
        return channel
        }

        return null
    }

    private getDiscordAccess(userId: string) {
        const guild = this.client.guilds.cache.get(this.config.guildId)
        if(!guild) return false

        const member = guild.members.cache.get(userId)
        if(!member) return false

        return member.roles.cache.some((r) => this.config.accessRoles.includes(r.id))
    }
}