import { AccountSchema, TAccount } from "./AccountSchema";
import Mongoose from "../Mongoose";

export default class AccountManager {    
    constructor(
        private db: Mongoose
    ) { this.autoRemoving() }

    async init() {
        const array = await this.array()
        for ( const doc of array ) {
            if(doc.qiwiBillId !== 'No') {
                const bill = await this.db.client.qiwi.bills.getStatus(doc.qiwiBillId)
                if(['EXPIRED', 'REJECTED'].includes(bill.status.value)) {
                    doc.qiwiBillId = 'No'
                    await doc.save()
                }
            } else {
                if(doc.balance === 0 && doc.transactions.length === 0 && doc.qiwiBillId === 'No') {
                    await this.remove({ doc })
                }
            }
        }
    }

    async array(options: { guildId?: string, userId?: string } = {}) {
        return (await AccountSchema.find(options))
    }

    async findOne(userId: string) {
        return (await AccountSchema.findOne({ userId }))
    }

    async findOneOrCreate(userId: string) {
        return (await this.findOne(userId) ?? await this.create(userId))
    }

    async create(userId: string) {
        const doc = await AccountSchema.create({ userId })
        return (await doc.save())
    }

    async remove(options: { userId?: string, doc?: TAccount }) {
        if(options.doc) {
            await options.doc.remove()
            return true
        } else if(options.userId) {
            const doc = await this.findOne(options.userId)
            if(!doc) return false

            await doc.remove()
        }

        return false
    }

    autoRemoving() {
        setInterval(async () => {
            const array = await this.array()

            for ( const doc of array ) {
                if(doc.balance === 0 && doc.transactions.length === 0 && doc.qiwiBillId === 'No') {
                    await this.remove({ doc })
                } else if(doc.qiwiBillId !== 'No') {
                    const bill = await this.db.client.qiwi.bills.getStatus(doc.qiwiBillId).catch(() => null)
                    if(!bill || ['EXPIRED', 'REJECTED'].includes(bill.status.value)) {
                        doc.qiwiBillId = 'No'
                        await doc.save()
                    }
                }
            }
        }, 600_000)
    }
}