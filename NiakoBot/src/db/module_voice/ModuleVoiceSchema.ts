import { Document, Schema, SchemaTypes, model } from "mongoose";
import { ButtonStyle, ColorResolvable } from "discord.js";

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

export interface IModuleVoice {
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
    defaultBlockRoles: string[],

    transferRoomAtOwnerLeave: boolean,
    sendMessageInRoom: boolean,
    noDeleteCreatedChannel: boolean
}

export type TModuleVoice = IModuleVoice & Document

export const ModuleVoiceSchema = model<IModuleVoice>(
    'ModuleVoice',
    new Schema<IModuleVoice>(
        {
            guildId: { type: SchemaTypes.String, required: true },

            state: { type: SchemaTypes.Boolean, default: false },
            type: { type: SchemaTypes.String, default: 'Custom' },
            game: { type: SchemaTypes.Boolean, default: false },
            embed: { type: SchemaTypes.String, default: '{"title": "123"}' },

            default: {
                type: Object,
                default: ({
                    roomName: '$username',
                    roomLimit: 1,
                    roleId: '0'
                })
            },

            messageId: { type: SchemaTypes.String, default: '0' },
            parentId: { type: SchemaTypes.String, default: '0' },
            textChannelId: { type: SchemaTypes.String, default: '0' },
            voiceChannelId: { type: SchemaTypes.String, default: '0' },
            webhook: {
                type: Object,
                default: ({
                    id: '0',
                    username: 'Niako',
                    avatar: 'avatar'
                })
            },
            color: { type: SchemaTypes.String, default: '#2B2D31' },
            style: { type: SchemaTypes.String, default: 'Default' },
            line: { type: SchemaTypes.String, default: 'None' },

            buttons: { type: Object, default: ({}) },
            defaultBlockRoles: { type: [], default: [] as string[] },

            transferRoomAtOwnerLeave: { type: SchemaTypes.Boolean, default: false },
            sendMessageInRoom: { type: SchemaTypes.Boolean, default: false },
            noDeleteCreatedChannel: { type: SchemaTypes.Boolean, default: false }
        }
    ),
    'module_voice'
)