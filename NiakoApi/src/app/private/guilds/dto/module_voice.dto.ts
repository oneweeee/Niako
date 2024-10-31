import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { ButtonStyle, ColorResolvable } from "discord.js"

export type IModuleVoiceButtonType = (
    'Crown' | 'Rename' | 'Limit' | 'Kick' | 'Lock' | 'Unlock'
    | 'RemoveUser' | 'AddUser' | 'Mute' | 'Unmute' | 'StateHide'
    | 'StateUser' | 'StateLock' | 'StateLock' | 'StateMute' | 'Reset'
    | 'Info' | 'PlusLimit' | 'MinusLimit' | 'Up'
)

export interface IModuleVoiceButton {
    type: IModuleVoiceButtonType,
    emoji?: string,
    label?: string,
    style: ButtonStyle,
    used: boolean,
    position: {
        row: number,
        button: number
    }
}

export type TModuleVoiceType = 'Default' | 'Compact' | 'Full' | 'DefaultFull' | 'Custom'

export type TModuleVoiceStyle = 'Default' | 'Pink' | 'Blue' | 'Red' | 'Purple' | 'Green' | 'Yellow'

export interface IModuleVoiceDto {
    guildId: string,
    
    state: boolean,
    type: TModuleVoiceType,
    game: boolean,
    embed: string,

    default: {
        roomName: string,
        roomLimit: number,
        roleId: string
    },

    defaultBlockRoles: string[],
    messageId: string,
    parentId: string,
    textChannelId: string,
    voiceChannelId: string,
    webhook: {
        id: string,
        avatar: string,
        username: string
    },
    color: ColorResolvable,
    style: TModuleVoiceStyle,
    line: string | 'None',

    buttons: { [key: string]: IModuleVoiceButton },

    transferRoomAtOwnerLeave: boolean,
    sendMessageInRoom: boolean,
    noDeleteCreatedChannel: boolean
}

export type TModuleVoiceDocument = IModuleVoiceDto & Document

@Schema({ collection: 'module_voice' })
export class ModuleVoice {
    @Prop({ required: true })
    guildId: string

    @Prop({ default: false })
    state: boolean

    @Prop({ default: 'Default' })
    type: TModuleVoiceType

    @Prop({ default: false })
    game: boolean

    @Prop({ default: '{"title": "123"}' })
    embed: string

    @Prop({ type: Object, default: ({ roomName: '$username', roomLimit: 0, roleId: '0' }) })
    default: {
        roomName: string,
        roomLimit: number,
        roleId: string
    }

    @Prop({ default: [] })
    defaultBlockRoles: string[]

    @Prop({ default: '0' })
    messageId: string

    @Prop({ default: '0' })
    parentId: string

    @Prop({ default: '0' })
    textChannelId: string

    @Prop({ default: '0' })
    voiceChannelId: string

    @Prop({ type: Object, default: ({ id: '0', avatar: 'https://niako.xyz/img/Logo.png', username: 'Niako' }) })
    webhook: {
        id: string,
        avatar: string,
        username: string
    }

    @Prop({ type: String, default: '#2B2D31' })
    color: ColorResolvable

    @Prop({ default: 'Default' })
    style: TModuleVoiceStyle

    @Prop({ default: 'None' })
    line: string | 'None'

    @Prop({ type: Object, default: {} })
    buttons: { [key: string]: IModuleVoiceButton }

    @Prop({ default: false })
    transferRoomAtOwnerLeave: boolean

    @Prop({ default: false })
    sendMessageInRoom: boolean

    @Prop({ default: false })
    noDeleteCreatedChannel: boolean
}

export const ModuleVoiceSchema = SchemaFactory.createForClass<IModuleVoiceDto>(ModuleVoice)