import { Schema, Document, model } from "mongoose"

export type IBackupPush = 'Kick' | 'Ban'

export interface IBackup {
    guildId: string,
    userId: string,
    name: string,
    data: string,
    createdTimestamp: number
}

export type TBackup = IBackup & Document

export default model<IBackup>(
    'Backup',
    new Schema(
        {
            guildId: { type: String, required: true },
            userId: { type: String, required: true },
            name: { type: String, required: true },
            data: { type: String, default: '' },
            createdTimestamp: { type: Number, default: 0 }
        }
    ),
    'backups'
)