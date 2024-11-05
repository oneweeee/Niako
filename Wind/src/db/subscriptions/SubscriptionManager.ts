import SubscriptionSchema, { TSubscription } from './SubscriptionSchema'
import { Collection } from 'discord.js'
import WindClient from '#client'

export default class SubscriptionManager {
    readonly guilds: Set<string> = new Set()

    constructor(
        private client: WindClient
    ) {}

    async init() {
        const array = await this.array()
        for ( let i = 0; array.length > i; i++ ) {
            const doc = array[i]
            if(doc.guildId) {
                const guild = this.client.guilds.cache.get(doc.guildId)
                if(guild) this.guilds.add(doc.guildId)
            }
        }
    }

    async array() {
        return (await SubscriptionSchema.find())
    }

    async create(userId: string, gift: boolean = false) {
        const doc = await SubscriptionSchema.create({ userId, gift })
        return (await doc.save())
    }

    async createMultiple(userId: string, count: number) {
        const subscriptions = []
        for ( let i = 0; count > i; i++ ) {
            subscriptions.push(await this.create(userId))
        }

        return subscriptions
    }
}