import { Document, Schema, SchemaTypes, model } from "mongoose";

export type TTextTypes = (
    'VoiceOnline' | 'UserCount' | 'Time' |
    'MemberCount' | 'BotCount' | 'BoostCount' |
    'BoostTier' | 'ActiveMemberTag' | 'ActiveMemberUsername' |
    'ActiveMemberDiscriminator' | 'ActiveMemberNickname' |
    'ActiveMemberStatus' | 'RoleMembers' | 'Default'
)

export interface IItemText {
    text: string,
    disabled: boolean,
    type: 'Text',
    textType: TTextTypes,

    color: string,
    align: 'center' | 'left' | 'right',
    baseline:  'middle' | 'bottom' | 'top',
    style: 'bold' | 'regular' | 'italic',
    length: number | 'None',
    font: string,
    size: number,
    width: number | 'None',
    timezone: string | 'None',
    angle: number | 'None',
    roleId?: string,
    isRazbit?: boolean,

    x: number,
    y: number,

    createdTimestamp: number
}

export interface IItemImage {
    name: string,
    disabled: boolean,
    type: 'Image' | 'ActiveMemberAvatar',

    radius: number,
    width: number,
    height: number,
    url: string,
    shape: boolean,

    x: number,
    y: number,

    createdTimestamp: number
}

export type TModuleBannerType = 'Compressed' | 'Normal'

export interface IModuleBanner {    
    guildId: string,

    background: string,
    type: TModuleBannerType,
    state: boolean,
    status: string,
    timezone: string,
    backgrounds: { [ key: string ]: string },
    
    nextUpdate: number,
    lastUpdate: number,
    updated: string,
    activeType: 'Online' | 'Message',
    activeUserId: string,
    activeUserStatus: string,
    activeUserUpdated: string,
    activeUserLastUpdate: number,
    gifed: boolean,

    items: (IItemText | IItemImage)[]
}

export type TModuleBanner = IModuleBanner & Document

export default model(
    'ModuleBanner',
    new Schema<IModuleBanner>(
        {
            guildId: { type: SchemaTypes.String, required: true },

            background: { type: SchemaTypes.String, default: 'Default' },
            type: { type: SchemaTypes.String, default: 'Compressed' },
            state: { type: SchemaTypes.Boolean, default: false },
            status: { type: SchemaTypes.String, default: 'Статус не задан' },
            timezone: { type: SchemaTypes.String, default: 'GMT-4' },
            backgrounds: { type: ({}), default: ({}) },

            activeType: { type: SchemaTypes.String, default: 'Online' },
            nextUpdate: { type: SchemaTypes.Number, default: Date.now() },
            lastUpdate: { type: SchemaTypes.Number, default: Date.now() },
            updated: { type: SchemaTypes.String, default: '10m' },
            activeUserId: { type: SchemaTypes.String, default: '0' },
            activeUserStatus: { type: SchemaTypes.String, default: 'Статус не задан' },
            activeUserUpdated: { type: SchemaTypes.String, default: '2h' },
            activeUserLastUpdate: { type: SchemaTypes.Number, default: Date.now() },
            gifed: { type: SchemaTypes.Boolean, default: false },

            items: { type: [], default: [] }
        }
    ),
    'module_banner'
)