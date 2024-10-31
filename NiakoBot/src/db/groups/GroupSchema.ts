import { Document, Schema, SchemaTypes, model } from "mongoose";

export interface IGroup {
    guildId: string,
    userId: string,
    channelId: string,

    name: string,
    code: string,
    messageId: string,
    limitUse: number,
    createdTimestamp: number
}

export type TGroup = IGroup & Document

export const GroupSchema =  model<IGroup>(
    'Group',
    new Schema<IGroup>(
        {
            guildId: { type: SchemaTypes.String, required: true },
            userId: { type: SchemaTypes.String, required: true },
            channelId: { type: SchemaTypes.String, default: '0' },

            name: { type: SchemaTypes.String, default: '$username' },
            code: { type: SchemaTypes.String, default: 'unknown' },
            messageId: { type: SchemaTypes.String, default: '0' },
            limitUse: { type: SchemaTypes.Number, default: -1 },
            createdTimestamp: { type: SchemaTypes.Number, default: Date.now() },
        }
    ),
    'groups'
)