import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
    type: ILoggerTypes,
    channelId: string,
    state: boolean
}

export interface ILoogerLog {
    channelId: string,
    state: boolean,
    types: ILoggerTypes[],
    createdTimestamp: number,
}

export interface IModuleAuditDto {
    guildId: string,
    
    state: boolean,
    channels: ILoogerLog[],
    types: IAuditType[]
}

@Schema({ collection: 'module_audit' })
export class ModuleAudit {
    @Prop({ required: true })
    guildId: string


    @Prop({ default: false })
    state: boolean

    @Prop({ default: [] })
    channels: ILoogerLog[]
    
    @Prop({ defaulT: [] })
    types: IAuditType[]
}

export const ModuleAuditSchema = SchemaFactory.createForClass<IModuleAuditDto>(ModuleAudit)