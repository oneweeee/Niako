import { Document, Schema, SchemaTypes, model } from "mongoose";

export interface IGuild {
    guildId: string,

    help: {
        sendingTimestamp: number
    }
}

export type TGuild = IGuild & Document

export default model(
    'Guild',
    new Schema<IGuild>(
        {
            guildId: { type: SchemaTypes.String, required: true },

            help: { type: Object, default: ({ sendingTimestamp: Date.now() }) },
        }
    ),
    'guilds'
)