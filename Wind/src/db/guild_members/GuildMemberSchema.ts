import { Schema, Document, model } from "mongoose"

export type IGuildMemberPush = 'Kick' | 'Ban'

export type IGuildMemberAction = 'TMute' | 'VMute' | 'GMute' | 'Timeout' | 'Lockdown' | 'Ban'

export interface IGuildMemberHistoryAction {
    type: IGuildMemberAction,
    executorId: string,
    createdTimestamp: number,
    active: boolean,
    time: number,
    reason?: string
}

export interface IGuildMemberHistoryNickname {
    old: string,
    new: string,
    executorId: string,
    updatedTimestamp: number
}

export interface IGuildMember {
    guildId: string,
    userId: string,
    roles: string[],
    warns: number,
    nicknames: IGuildMemberHistoryNickname[],
    actions: IGuildMemberHistoryAction[]
}

export type TGuildMember = IGuildMember & Document

export default model<IGuildMember>(
    'GuildMember',
    new Schema(
        {
            guildId: { type: String, required: true },
            userId: { type: String, required: true },
            roles: { type: [], default: [] },
            warns: { type: Number, default: 0 },
            nicknames: { type: [], default: [] },
            actions: { type: [], default: [] }
        }
    ),
    'guild_members'
)