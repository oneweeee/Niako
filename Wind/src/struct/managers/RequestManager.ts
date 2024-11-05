import { Guild } from "discord.js"
import WindClient from "#client"
import fetch from "node-fetch"

export default class RequestManager {
    private readonly api: string

    constructor(
        private client: WindClient
    ) { this.api = client.config.apiUrl }

    init() {
        if(this.client.config.debug) return

        setInterval(() => this.putStats(), 60_000)
        setTimeout(() => this.postStats(), 10_000)
    }

    postStats() {
        return fetch(this.getPath('/public/stats'), {
            method: 'Post', headers: this.getAuth(),
            body: JSON.stringify({ id: this.client.cluster.id })
        }).catch(() => {})
    }

    putStats() {
        return fetch(this.getPath('/public/stats'), {
            method: 'Put', headers: this.getAuth(), body: JSON.stringify(
                {
                    id: this.client.cluster.id, ping: this.client.ws.ping,
                    guildCount: this.client.guilds.cache.size,
                    memberCount: this.client.guilds.cache.size,
                    shards: [ ...this.client.cluster.ids.keys()].map((n) => Number(n))
                }
            )
        }).catch(() => {})
    }

    async postTopGuilds() {
        const guilds = ((await this.client.cluster.broadcastEval(
            client => client.guilds.cache.map((g) => g)
        )).flat() as Guild[])

        return fetch(this.getPath('/public/top-guilds'), {
            method: 'Post', headers: this.getAuth(), body: JSON.stringify(
                guilds.map((g) => ({ id: g.id, name: g.name, memberCount: g.memberCount, icon: this.getGuildIcon(g) }))
            )
        }).catch(() => {})
    }

    async postGuilds() {
        return fetch(this.getPath('/private/guilds'), {
            method: 'Post', headers: this.getAuth(), body: JSON.stringify(
                this.client.guilds.cache.map((g) => g.id)
            )
        }).catch(() => {})
    }

    async putGuild(id: string, state: boolean) {
        return fetch(this.getPath('/private/guilds'), {
            method: 'Put', headers: this.getAuth(),
            body: JSON.stringify({ id, state })
        }).catch(() => {})
    }

    private getAuth() {
        return { 'Authorization': 'ebalo', 'Content-Type': 'application/json' }
    }

    private getGuildIcon(g: Guild) {
        if(!g?.icon) return null
        return `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.${g.icon.startsWith('a_') ? 'gif' : 'png'}?size=4096`
    }
    
    private getPath(path: string) {
        return this.api + path
    }
}