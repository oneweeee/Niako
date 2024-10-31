import { Document, Schema, SchemaTypes, model } from "mongoose";

export type ILoggerTypes = (
    'guildMemberAdd' | 'guildMemberRemove' | 'guildBotAdd' | 'guildBotRemove'
    | 'guildUpdate' | 'voiceStateJoin' | 'voiceStateLeave' | 'voiceStateUpdate'
    | 'channelCreate' | 'channelUpdate' | 'channelDelete' | 'emojiCreate'
    | 'emojiDelete' | 'emojiUpdate' | 'stickerCreate' | 'stickerDelete'
    | 'stickerUpdate' | 'roleCreate' | 'roleDelete' | 'roleUpdate'
    | 'inviteCreate' | 'inviteDelete' | 'guildBanAdd' | 'guildBanRemove'
    | 'messageDelete' | 'messageUpdate' | 'guildScheduledEventCreate'
    | 'guildScheduledEventDelete' | 'guildScheduledEventUpdate'
    | 'guildMemberNicknameUpdate' | 'guildMemberRoleAdd' | 'guildMemberRoleRemove'
)

export interface IAuditType {
    channelId: string,
    state: boolean,
    type: ILoggerTypes
}

export interface ILoogerLog {
    channelId: string,
    state: boolean,
    types: ILoggerTypes[],
    createdTimestamp: number,
}

export interface IModuleAudit {
    guildId: string,
    
    state: boolean,
    channels: ILoogerLog[],
    types: IAuditType[]
}

export type TModuleAudit = IModuleAudit & Document

export const ModuleAuditSchema = model<IModuleAudit>(
    'ModuleAudit',
    new Schema<IModuleAudit>(
        {
            guildId: { type: SchemaTypes.String, required: true },

            state: { type: SchemaTypes.Boolean, default: false },
            channels: { type: [], default: [] },
            types: { type: [], default: [] }
        }
    ),
    'module_audit'
)