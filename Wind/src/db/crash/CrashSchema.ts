import { Schema, Document, model } from "mongoose"

export type ICrashPush = 'Ban' | 'Kick' | 'Warn' | 'Lockdown' | 'None'

export type ICrashActionType = (
    'AddBot' | 'CreateChannel' | 'DeleteChannel' |
    'EditChannel' | 'EditEmoji' | 'EditGuildBanner' |
    'EditGuildIcon' | 'EditGuildName' | 'EditGuildLink' |
    'MemberBan' | 'AddRoleDefault' | 'AddMemberRoleAdmin' |
    'MemberKick' | 'EditNicknames' | 'RemoveRole' |
    'MemberTimeout' | 'MemberUnban' | 'MentionGuild' |
    'CreateRole' | 'CreateAdminRole' | 'DeleteRole' |
    'AddRoleAdminPerms' | 'EditRole' | 'CreateWebhook'
)

export type TCrashGroupType = 'Role' | 'Member' | 'Custom'

export interface IAction {
    type: ICrashActionType
    push: ICrashPush
}

export interface IGroup {
    roleId: string,
    members: string[],
    type: TCrashGroupType,
    disabled?: boolean,
    name?: string,
    actions: IAction[]
}

export interface ICrash {
    guildId: string,
    channelId: string,
    banId: string,
    status: boolean,
    warnResolve: number,
    whiteList: string[],
    groups: IGroup[]
}

export type TCrash = ICrash & Document

export default model<ICrash>(
    'Crash',
    new Schema(
        {
            guildId: { type: String, required: true },
            channelId: { type: String, default: '0' },
            banId: { type: String, default: '0' },
            status: { type: Boolean, default: false },
            warnResolve: { type: Number, default: 5 },
            whiteList: { type: [], default: [] },
            groups: { type: [], default: [] }
        }
    ),
    'crash'
)