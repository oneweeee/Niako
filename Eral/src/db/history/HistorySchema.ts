import { Document, Schema, SchemaTypes, model } from "mongoose";

export enum HistoryTypes {
    Warn = 0,
    Mute = 1,
    Ban = 2
}

export interface IHistory {
    guildId: string,
    userId: string,

    state: boolean,
    type: HistoryTypes,
    staffId: string,
    reason: string,
    time: string,
    end: number,
    createdTimestamp: number
}

export type THistory = IHistory & Document

export default model(
    'History',
    new Schema<IHistory>(
        {
            guildId: { type: SchemaTypes.String, required: true },
            userId: { type: SchemaTypes.String, required: true },

            state: { type: SchemaTypes.Boolean, default: true },
            type: { type: SchemaTypes.Number, required: true },
            staffId: { type: SchemaTypes.String, required: true },
            reason: { type: SchemaTypes.String, required: true },
            time: { type: SchemaTypes.String, required: true },
            end: { type: SchemaTypes.Number, required: true },
            createdTimestamp: { type: SchemaTypes.Number, default: Date.now() }
        }
    ),
    'history'
)