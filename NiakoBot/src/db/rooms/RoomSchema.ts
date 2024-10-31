import { Document, Schema, SchemaTypes, model } from "mongoose";

export interface IRoom {
    guildId: string,
    userId: string,
    //channelId: string,
    channels: string[]

    name: string,
    nameCount: number,
    nameCooldown: number,
    limit: number,
    joinCooldown: number,
    created: number,
    stateCreated: boolean
}

export type TRoom = IRoom & Document

export const RoomSchema =  model<IRoom>(
    'Room',
    new Schema<IRoom>(
        {
            guildId: { type: SchemaTypes.String, required: true },
            userId: { type: SchemaTypes.String, required: true },
            //channelId: { type: SchemaTypes.String, default: '0' },
            channels: { type: [], default: [] },

            name: { type: SchemaTypes.String, default: '$username' },
            nameCount: { type: SchemaTypes.Number, default: 0 },
            nameCooldown: { type: SchemaTypes.Number, default: 0 },
            limit: { type: SchemaTypes.Number, default: 0 },
            joinCooldown: { type: SchemaTypes.Number, default: 0 },
            created: { type: SchemaTypes.Number, default: Date.now() },
            stateCreated: { type: SchemaTypes.Boolean, default: true }
        }
    ),
    'rooms'
)