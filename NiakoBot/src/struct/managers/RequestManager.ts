import { ApplicationCommandOptionType } from "discord.js";
import { NiakoClient } from "../client/NiakoClient";
import fetch from "node-fetch";

export default class RequestManager {
    public readonly password: string = 'huila228Niako'
    public apiUrl: string
    
    constructor(
        private client: NiakoClient
    ) {
        this.apiUrl = client.config.apiUrl
    }

    init() {
        if(this.client.config.debug) return

        if(this.client.cluster.id === 0) {
            setInterval(() => this.commands(), 60_000)
        }
        
        this.shardActive()
        this.guilds()

        setInterval(() => this.stats(), 60_000)
        setInterval(() => this.guilds(), 60_000)
    }

    shardActive() {
        fetch(`${this.apiUrl}/public/stats`, {
            method: 'Post',
            headers: {
                'Authorization': this.password,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clusterId: this.client.cluster.id,
                shards: [...this.client.cluster.ids.keys()]
            })
        }).catch(() => {})
    }

    stats() {
        fetch(`${this.apiUrl}/public/stats`, {
            method: 'Put',
            headers: {
                'Authorization': this.password,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                clusterId: this.client.cluster.id,
                shards: [...this.client.cluster.ids.keys()],
                guildCount: this.client.guilds.cache.size,
                memberCount: this.client.guilds.cache.reduce((n, g) => n + g.memberCount, 0),
                ping: this.client.ws.ping
            })
        }).catch(() => {})
    }

    commands() {
        const commands = this.client.storage.slashCommands.cache
        .filter((c) => ((c.options?.options?.length || 0) === 0) || !(c.options.options || []).some((c) => c.type === ApplicationCommandOptionType.Subcommand))
        .map((c) => ({ ...c.options, name: c.name }))

        const optionsCommands = this.client.storage.slashCommands.cache
        .filter((c) => ((c.options?.options?.length || 0) > 0) && (c.options?.options || []).map((s) => s.type).includes(ApplicationCommandOptionType.Subcommand))
        .map((c) => {
            return c.options.options!.map((s) => {
                return { ...c.options, ...s, name: `${c.name} ${s.name}` }
            })
        })

        for ( let i = 0; optionsCommands.length > i; i++ ) {
            optionsCommands[i].map((data) => commands.push(data as any))
        }

        fetch(`${this.apiUrl}/public/commands`, {
            method: 'Post',
            headers: {
                'Authorization': this.password,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ commands })
        }).catch(() => {})
    }

    guilds() {
        fetch(`${this.apiUrl}/private/guilds`, {
            method: 'Post',
            headers: {
                'Authorization': this.password,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.client.guilds.cache.map((g) => g.id))
        }).catch(() => {})
    }

    async resolveGuild(id: string, state: boolean) {
        fetch(`${this.apiUrl}/private/guilds/${state ? 'add' : 'remove'}`, {
            method: 'Put',
            headers: {
                'Authorization': this.password,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        }).catch(() => {})
    }

    error(error: Error) {
        fetch(`${this.apiUrl}/private/error`, {
            method: 'Post',
            headers: {
                'Authorization': this.password,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(error)
        }).catch(() => {})
    }

    async getStats() {
        const res = await fetch(`${this.apiUrl}/public/stats`)
        .then(async (res) => await res.json()).catch(() => null)

        return res as {
            totalUsers: number, totalGuilds: number, clusters: { id: string, name: string, shardList: string[] }[]
            shards: {
                shardId: number, guildCount: number, memberCount: number, clusterId: string,
                ping: string, state: string, statsUpdate: number, lastUpdate: number
            }[]
        } | null
    }

    async getReactions() {
        return (
            await fetch(`${this.apiUrl}/public/images/reactions`)
            .then(async (res) => await res.json())
        )
    }
}