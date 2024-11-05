import WindApi from "../../index";
import * as jwt from "jsonwebtoken";
import {
    clientId,
    clientSecret,
    logger,
} from "#config";

export default class UserService {    
    async authorization(api: WindApi, code: string, redirect_uri: string) {
        const res = await fetch(
            'https://discordapp.com/api/oauth2/token',
            {
                method: 'Post',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    'client_id': clientId,
                    'client_secret': clientSecret,
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

        const account = await this.getUserInfo(api, res.access_token)
        if(typeof account === 'string') return account

        return { cookie: this.generateUserCookie(account.doc, account.user), firstLogin: account.firstLogin }
    }

    async getUserInfo(api: WindApi, access_token: string): Promise<string | { user: any, doc: any, firstLogin: boolean }> {
        const res = await fetch(
            'https://discord.com/api/users/@me',
            {
                headers: {
                    authorization: `Bearer ${access_token}`
                }
            }
        ).then(async (res) => await res.json()).catch((err) => ({ ...err }))

        if(res?.error || res?.message) return (res?.error || res?.message)
        
        const get = await api.client.db.accounts.getUserId(res.id)
        if(get) {
            get.accessToken = access_token
            return { user: res, doc: (await api.client.db.accounts.save(get)), firstLogin: true }
        } else {
            const doc = await api.client.db.accounts.create({ userId: res.id, accessToken: access_token, token: this.createJwtToken({ userId: res.id, accessToken: access_token }) })
            return { user: res, doc, firstLogin: false }
        }
    }

    async delete(api: WindApi, token: string) {
        const doc = await api.client.db.accounts.getToken(token)
        if(!doc) return 'Not have token'

        return (await api.client.db.accounts.delete(doc))
    }

    generateUserCookie(doc: any, user: any) {
        return { ...user, token: doc.token, favoriteGuilds: doc.favoriteGuilds }
    }

    sendWebsiteLog(api: WindApi, content: string) {
        return api.client.cluster.broadcastEval((client, ctx) => {
            const channel = client.channels.cache.get(ctx.channelId) as any
            if(channel) {
                return channel.send({ content: ctx.content })
            }
        }, { context: { channelId: logger.website, content } })
    }

    getUsername(options: { username: string, discriminator: string }) {
        if(options.discriminator === '0') {
            return options.username
        } else {
            return `${options.username}#${options.discriminator}`
        }
    }

    private createJwtToken(doc: { userId: string, accessToken: string }) {
        const token = jwt.sign(
            {
                "userId": doc.userId,
                "createdTimestamp": Date.now(),
                "message": "Where are we going? Leave like a human being",
            },
            doc.accessToken
        )

        return token
    }
}