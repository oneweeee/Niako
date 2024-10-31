import { Document, Schema, SchemaTypes, model } from "mongoose";

export interface IMember {
    guildId: string,
    userId: string,

    online: {
        all: number,
        banner: number
    },
    message: {
        all: number,
        banner: number
    }
}

export type TMember = IMember & Document

export const MemberSchema =  model<IMember>(
    'Member',
    new Schema<IMember>(
        {
            guildId: { type: SchemaTypes.String, required: true },
            userId: { type: SchemaTypes.String, required: true },

            online: { type: Object, default: ({ all: 0, banner: 0 }) },
            message: { type: Object, default: ({ all: 0, banner: 0 }) }
        }
    ),
    'members'
)