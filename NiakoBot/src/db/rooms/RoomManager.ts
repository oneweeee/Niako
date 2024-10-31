import { RoomSchema, TRoom } from "./RoomSchema";
import { Collection } from "discord.js";
import Mongoose from "../Mongoose";

export default class RoomManager {
    private readonly channels: Collection<string, string> = new Collection()
    private readonly cache: Collection<string, TRoom> = new Collection()

    constructor(
        private db: Mongoose
    ) {}

    async init() {
        const array = await this.array()
        for( let i = 0; array.length > i; i++ ) {
            const doc = array[i]
            if(doc.channels.length > 0) {
                const guild = this.db.client.guilds.cache.get(array[i].guildId)
                if(guild) {
                    doc.channels.map((channelId) => {
                        this.channels.set(channelId, doc.userId)
                        const channel = guild.channels.cache.get(channelId)
                        if(channel) {
                            this.cache.set(`${array[i].guildId}.${array[i].userId}`, array[i])
                        }
                    })
                }
            }
        }
    }

    /*async copyright() {
        const array = (await this.array()).filter((d) => d.channelId !== '0')
        this.db.client.logger.info(`Starting update docs... ${array.length}`)
        for( let i = 0; array.length > i; i++ ) {
            const doc = array[i]
            doc.channels.push(doc.channelId)
            await this.save(doc).then(() => this.db.client.logger.log(`Документ румы ${i} сохранён`))
        }
    }*/

    async array(cache: boolean = false) {
        return cache ? this.cache.map((g) => g) : (await RoomSchema.find())
    }

    /*async getChannelId(channelId: string) {
        return (await RoomSchema.findOne({ channelId }))
    }*/

    async get(key: string) {
        if(this.cache.has(key)) {
            return this.cache.get(key)!
        } else {
            const guildId = key.split('.')[0]
            const userId = key.split('.')[1]
            return (await RoomSchema.findOne({ guildId, userId }) ?? this.create(guildId, userId))
        }
    }

    async create(guildId: string, userId: string) {
        const doc = await RoomSchema.create({ guildId, userId })
        return (await this.save(doc))
    }

    async save(doc: TRoom) {
        const saved = await doc.save()
        this.cache.set(`${doc.guildId}.${doc.userId}`, saved)
        return saved
    }

    async remove(doc: TRoom) {
        if(this.cache.has(`${doc.guildId}.${doc.userId}`)) {
            this.cache.delete(`${doc.guildId}.${doc.userId}`)
        }

        await doc.remove().catch(() => {})
    }

    async removeGuildRooms(guildId: string) {
        const array = await RoomSchema.find({ guildId })
        for ( let i = 0; array.length > i; i++ ) {
            if(this.cache.has(`${array[i].guildId}.${array[i].userId}`)) {
                this.cache.delete(`${array[i].guildId}.${array[i].userId}`)
            }
            
            await this.remove(array[i])
        }
    }

    pushChannel(channelId: string, ownerId: string) {
        this.channels.set(channelId, ownerId)
    }

    hasChannel(channelId: string) {
        return this.channels.has(channelId)
    }

    removeChannel(channelId: string) {
        return this.channels.delete(channelId)
    }

    async getChannel(channelId: string) {
        if(this.channels.has(channelId)) {
            return (await RoomSchema.find({ userId: this.channels.get(channelId)! })).find((d) => d.channels.includes(channelId))
        }
    }

    getChannelOwner(channelId: string) {
        return this.channels.get(channelId)
    }
}