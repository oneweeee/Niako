import AccountSchema, { TAccount } from "./AccountSchema"
import { Collection } from "discord.js"
import WindClient from "#client"

export default class AccountManager {
    private readonly cache: Collection<string, TAccount> = new Collection()

    constructor(
        private client: WindClient
    ) {}

    async init() {
        const array = await this.array()
        for ( let i = 0; array.length > i; i++ ) {
            const doc = array[i]
            if(doc.token) {
                this.cache.set(`${doc.userId}:${doc.token}`, doc)
            }
        }
    }

    async array(cache: boolean = false, options: {} = {}) {
        if(!cache) {
            return (await AccountSchema.find(options))
        } else {
            return this.cache.map((v) => v)
        }
    }

    async getToken(token: string) {
        const find = this.cache.find((_, k) => k.endsWith(token))
        if(find) {
            return find
        } else {
            return (await this.getOptions({ token }))
        }
    }

    async getUserId(userId: string) {
        const find = this.cache.find((_, k) => k.startsWith(userId))
        if(find) {
            return find
        } else {
            return (await this.getOptions({ userId }))
        }
    }

    async getOptions(options: { userId: string } | { token: string}) {
        return (await AccountSchema.findOne(options))
    }

    async create(options: { userId: string, accessToken: string, token: string }) {
        return (await AccountSchema.create(options))
    }

    async save(doc: TAccount) {
        const saved = await doc.save().catch(() => null)
        if(saved) this.cache.set(`${saved.userId}:${saved.token}`, saved)
        return saved
    }

    async delete(doc: TAccount) {
        if(this.cache.has(`${doc.userId}:${doc.token}`)) {
            this.cache.delete(`${doc.userId}:${doc.token}`)
        }

        const oldDoc = doc.toObject()

        await doc.deleteOne({ token: doc.token })

        return oldDoc
    }
}