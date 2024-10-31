import { Document, Schema, SchemaTypes, model } from "mongoose";
import { Track } from "shoukaku";

export interface INiakoTrack extends Track {
    requster: {
        username: string,
        avatar: string
    },
    start: number
}

export interface IStringTrack {
    [key: string]: INiakoTrack
}

export interface IQueue {
    guildId: string,
    voiceId: string,
    textId: string,
    messageId: string,

    volume: number,
    repeat: 'None' | 'Queue' | 'Track',
    filter: string | 'None'
    lasts: IStringTrack,
    tracks: INiakoTrack[],
    played: boolean,
    paused: boolean,
    pausedTimestamp: number
}

export type TQueue = IQueue & Document

export const QueueSchema =  model<IQueue>(
    'Queue',
    new Schema<IQueue>(
        {
            guildId: { type: SchemaTypes.String, required: true },
            voiceId: { type: SchemaTypes.String, default: '0' },
            textId: { type: SchemaTypes.String, default: '0' },
            messageId: { type: SchemaTypes.String, default: '0' },

            volume: { type: SchemaTypes.Number, default: 0.5 },
            repeat: { type: SchemaTypes.String, default: 'None' },
            filter: { type: SchemaTypes.String, default: 'None' },
            lasts: { type: Object, default: ({}) },
            tracks: { type: [], default: [] },
            played: { type: SchemaTypes.Boolean, default: false },
            paused: { type: SchemaTypes.Boolean, default: false },
            pausedTimestamp: { type: SchemaTypes.Number, default: 0 }
        }
    ),
    'queues'
)