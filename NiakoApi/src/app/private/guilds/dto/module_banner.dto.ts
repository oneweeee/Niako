import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface IModuleBannerDto {
    guildId: string

    background: string,
    type: string,
    state: boolean,
    status: string,
    timezone: string,
    backgrounds: { [ key: string ]: string }
    
    nextUpdate: number,
    lastUpdate: number,
    updated: string,
    activeUserId: string,
    activeUserStatus: string,
    activeUserUpdated: string,
    activeUserLastUpdate: number,
    activeType: 'Online' | 'Message',

    items: any[]
}

export type TModuleBannerDocument = IModuleBannerDto & Document

@Schema({ collection: 'module_banner' })
export class ModuleBanner {
    @Prop({ required: true })
    guildId: string

    @Prop({ default: 'Default' })
    background: string

    @Prop({ default: 'Compressed' })
    type: string

    @Prop({ default: false })
    state: boolean

    @Prop({ default: 'Статус не задан' })
    status: string

    @Prop({ default: 'GMT-4' })
    timezone: string

    @Prop({ type: Object, default: ({}) })
    backgrounds: any

    @Prop({ default: Date.now() })
    nextUpdate: number

    @Prop({ default: Date.now() })
    lastUpdate: number
    
    @Prop({ default: '10m' })
    updated: string

    @Prop({ default: '0' })
    activeUserId: string

    @Prop({ default: 'Статус не задан' })
    activeUserStatus: string

    @Prop({ default: '2h' })
    activeUserUpdated: string

    @Prop({ default: Date.now() })
    activeUserLastUpdate: number

    @Prop({ default: 'Online'})
    activeType: 'Online' | 'Message'

    @Prop({ default: [] })
    items: any[]
}

export const ModuleBannerSchema = SchemaFactory.createForClass<IModuleBannerDto>(ModuleBanner)