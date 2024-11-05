import { Schema, Document, model } from "mongoose"

export type IAuditType = (
    'GuildMemberAdd' | 'GuildMemberRemove' | 'GuildBotAdd' | 'GuildBotRemove'
    | 'GuildUpdate' | 'VoiceStateJoin' | 'VoiceStateLeave' | 'VoiceStateUpdate'
    | 'ChannelCreate' | 'ChannelUpdate' | 'ChannelDelete' | 'EmojiCreate'
    | 'EmojiDelete' | 'EmojiUpdate' | 'StickerCreate' | 'StickerDelete'
    | 'StickerUpdate' | 'RoleCreate' | 'RoleDelete' | 'RoleUpdate'
    | 'InviteCreate' | 'InviteDelete' | 'GuildBanAdd' | 'GuildBanRemove'
    | 'MessageDelete' | 'MessageUpdate' | 'GuildScheduledEventCreate'
    | 'GuildScheduledEventDelete' | 'GuildScheduledEventUpdate'
    | 'GuildMemberNicknameUpdate' | 'GuildMemberRoleAdd' | 'GuildMemberRoleRemove'
    | 'GuildMuteAdd' | 'GuildMuteRemove' | 'PresenceStatus'
)

export interface IAuditTypes {
    type: IAuditType,
    enabled: boolean,
    channelId: string
}

export interface IAudit {
    guildId: string,
    types: IAuditTypes[],
    enabled: boolean
}

export type TAudit = IAudit & Document

export default model<IAudit>(
    'Audit',
    new Schema(
        {
            guildId: { type: String, required: true },
            types: { type: [], default: [] },
            enabled: { type: Boolean, default: false }
        }
    ),
    'audit'
)