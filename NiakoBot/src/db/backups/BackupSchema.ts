import { IItemImage, IItemText, TModuleBannerType } from "../module_banner/ModuleBannerSchema";
import { Document, Schema, SchemaTypes, model } from "mongoose";

export type TBackupType = 'Guild' | 'User'

export interface IBackup {
    name: string,
    id: string,
    type: TBackupType,

    background: string,
    bannerType: TModuleBannerType,
    status: string,
    
    updated: string,
    activeUserUpdated: string,

    items: (IItemText | IItemImage)[],

    createrId: string,
    createdTimestamp: number
}

export interface ICreateBackupOptions {
    name: string,
    id: string,
    type: TBackupType,
    background: string,
    bannerType: TModuleBannerType,
    updated: string,
    activeUserUpdated: string,
    items: (IItemText | IItemImage)[],
    status: string,
    createrId: string
}

export type TBackup = IBackup & Document

export default model(
    'Backup',
    new Schema<IBackup>(
        {
            name: { type: SchemaTypes.String, required: true },
            id: { type: SchemaTypes.String, required: true },
            type: { type: SchemaTypes.String, required: true },

            background: { type: SchemaTypes.String, default: 'Default' },
            bannerType: { type: SchemaTypes.String, default: 'Compressed' },
            status: { type: SchemaTypes.String, default: 'Статус не задан' },

            updated: { type: SchemaTypes.String, default: '10m' },
            activeUserUpdated: { type: SchemaTypes.String, default: '2h' },

            items: { type: [], default: [] },

            createrId: { type: SchemaTypes.String, required: true },
            createdTimestamp: { type: SchemaTypes.Number, default: Date.now() }
        }
    ),
    'backups'
)