import GuildService from "./service/GuildService";
import BaseRoute from "../base/BaseRoute";
import { Locale } from "discord.js";

export default class GetCommands extends BaseRoute {
    private readonly service = new GuildService()

    constructor() {
        super(
            'guild',
            [
                {
                    path: 's',
                    method: 'Get',
                    run: async (api, req, res) => {
                        return res.send(api.buildSuccess('Success get guild ids', this.service.get()))
                    }
                },
                {
                    path: 's',
                    method: 'Post',
                    run: async (api, req, res) => {
                        const auth = api.getAuth(req)
                        if(auth) {
                            return res.send(auth)
                        }

                        if(!req.body?.length) {
                            return res.send(api.buildError('Nove have id', 500))
                        }

                        this.service.post(req.body)

                        return res.send(api.buildSuccess('Success post guild ids', this.service.get()))
                    }
                },
                {
                    path: 's',
                    method: 'Put',
                    run: async (api, req, res) => {
                        const auth = api.getAuth(req)
                        if(auth) {
                            return res.send(auth)
                        }

                        const guildId = req.body?.id
                        if(!guildId || typeof guildId !== 'string') {
                            return res.send(api.buildError('Nove have id', 500))
                        }

                        this.service.put(guildId, req.body?.state)

                        return res.send(api.buildSuccess('Success put guild ids', this.service.get()))
                    }
                },
                {
                    path: '/:id',
                    method: 'Get',
                    run: async (api, req, res) => {
                        const token = req.headers.authorization
                        if(!token) {
                            return res.send(api.buildError('No auth', 403))
                        }

                        const doc = await api.client.db.accounts.getToken(token)
                        if(!doc) {
                            return res.send(api.buildError('Invalid token', 404))
                        }

                        const guildId = req.params?.id
                        if(!guildId) {
                            return res.send(api.buildError('Nove have id', 500))
                        }

                        if(!(await this.service.accessedGuild(doc, guildId))) {
                            return res.send(api.buildError('Not available you', 403))
                        }
                        
                        const data = await api.client.cluster.broadcastEval((client, ctx) => {
                            const guild = client.guilds.cache.get(ctx.guildId)
                            if(guild && !guild.members.cache.get(ctx.userId)) {
                                return {
                                    id: guild.id,
                                    name: guild.name,
                                    icon: guild.iconURL({ extension: 'png', forceStatic: false, size: 4096 }),
                                    banner: guild.bannerURL({ extension: 'png', forceStatic: false, size: 4096 }),
                                    splash: guild.splashURL({ extension: 'png', forceStatic: false, size: 4096 }),
                                    roles: guild.roles.cache.map((role) => {                        
                                        return {
                                            id: role.id,
                                            name: role.name,
                                            color: role.hexColor,
                                            permissions: role.permissions.toArray(),
                                            hoist: role.hoist,
                                            mentionable: role.mentionable,
                                            position: role.position,
                                            createdTimestamp: role.createdTimestamp,
                                            members: role.members.map((m) => m.id)
                                        }
                                    }),
                                    channels: guild.channels.cache.map((channel) => {                        
                                        return {
                                            id: channel.id,
                                            name: channel.name,
                                            type: channel.type,
                                            createdTimestamp: channel.createdTimestamp
                                        }
                                    }),
                                    emojis: guild.emojis.cache.map((e) => (
                                        { id: e.id, name: e.name, animated: e.animated, url: e.url }
                                    ))
                                }
                            } else return null
                        }, { context: { guildId, userId: doc.userId }}).catch(() => [null]) as any[]

                        const get = data.find((g) => Boolean(g))

                        return res.send(
                            get ? api.buildSuccess('Success get discord guild data', get) : api.buildError('Unknown guild', 404)
                        )
                    }
                },
                {
                    path: '/:id/main',
                    method: 'Get',
                    run: async (api, req, res) => {
                        const token = req.headers.authorization
                        if(!token) {
                            return res.send(api.buildError('No auth', 400))
                        }

                        const doc = await api.client.db.accounts.getToken(token)
                        if(!doc) {
                            return res.send(api.buildError('Invalid token', 403))
                        }

                        const guildId = req.params?.id
                        if(!guildId) {
                            return res.send(api.buildError('Nove have id', 404))
                        }

                        if(!(await this.service.accessedGuild(doc, guildId))) {
                            return res.send(api.buildError('Not available you', 403))
                        }

                        const get = await api.client.db.guilds.get(guildId, Locale.EnglishUS)

                        return res.send(api.buildSuccess('Success get guild main data', get))
                    }
                },
                {
                    path: '/:id/main',
                    method: 'Put',
                    run: async (api, req, res) => {
                        const token = req.headers.authorization
                        if(!token) {
                            return res.send(api.buildError('No auth', 403))
                        }

                        const doc = await api.client.db.accounts.getToken(token)
                        if(!doc) {
                            return res.send(api.buildError('Invalid token', 404))
                        }

                        const guildId = req.params?.id
                        if(!guildId) {
                            return res.send(api.buildError('Nove have id', 500))
                        }

                        const body = req.body
                        if(!body?.guildId) {
                            return res.send(api.buildError('Nove have id', 500))
                        }

                        if(!(await this.service.accessedGuild(doc, guildId))) {
                            return res.send(api.buildError('Not available you', 403))
                        }

                        let get = await api.client.db.guilds.get(guildId, Locale.EnglishUS)
                        let saved: boolean = false

                        if(body?.locale && body.locale !== get.locale) {
                            if(
                                [
                                    Locale.Russian,
                                    Locale.EnglishUS
                                ].includes(body.locale)
                            ) {
                                saved = true
                                get.locale = body.locale
                            }
                        }

                        if(body?.color && body?.color !== get.color) {
                            get.color = api.client.util.isColor(body.color) ? body.color : ''
                            saved = true
                        }

                        if(saved) {
                            get = await api.client.db.guilds.save(get)
                            api.connections.map((s) => s.send(JSON.stringify({ method: 'putGuildMain', guildId })))
                        }

                        return res.send(api.buildSuccess('Success put guild main data', get))
                    }
                },
                {
                    path: 's/user',
                    method: 'Get',
                    run: async (api, req, res) => {
                        const token = req.headers?.authorization
                        if(!token) {
                            return res.send(api.buildError('Unauthorized', 400))
                        }

                        const account = await api.client.db.accounts.getToken(token)
                        if(!account) {
                            return res.send(api.buildError('Invalid token', 404))
                        }

                        const guilds = await this.service.getListUserGuilds(account.accessToken, account.token)

                        return res.send(api.buildSuccess('Success get user discords guilds list', guilds))
                    }
                },
                {
                    path: '/user/favorite',
                    method: 'Post',
                    run: async (api, req, res) => {
                        const token = req.headers?.authorization
                        if(!token) {
                            return res.send(api.buildError('Unauthorized', 400))
                        }

                        const account = await api.client.db.accounts.getToken(token)
                        if(!account) {
                            return res.send(api.buildError('Invalid token', 404))
                        }

                        if(typeof req.query?.guildId !== 'string') {
                            return res.send(api.buildError('No have guild id', 404))
                        } 

                        let state: boolean
                        if(account.favoriteGuilds.includes(req.query.guildId)) {
                            account.favoriteGuilds.splice(
                                account.favoriteGuilds.indexOf(req.query.guildId), 1
                            )
                            state = false
                        } else {
                            account.favoriteGuilds.push(req.query.guildId)
                            state = true
                        }

                        await api.client.db.accounts.save(account)

                        return res.send(
                            api.buildSuccess(
                                'Success get user discords guilds list',
                                { guildId: req.query.guildId, state }
                            )
                        )
                    }
                }
            ]
        )
    }
}