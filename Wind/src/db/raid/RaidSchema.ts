import { Schema, Document, model } from "mongoose"

export type IRaidPush = 'Kick' | 'Ban'

export interface IRaid {
    guildId: string,
    channelId: string,
    status: boolean,

    memberCount: number,
    timeJoin: number,

    push: IRaidPush
}

export type TRaid = IRaid & Document

export default model<IRaid>(
    'Raid',
    new Schema(
        {
            guildId: { type: String, required: true },
            channelId: { type: String, default: '0' },
            status: { type: Boolean, default: false },

            memberCount: { type: Number, default: 3 },
            timeJoin: { type: Number, default: 10000 },

            push: { type: String, default: 'Kick' }
        }
    ),
    'raid'
)