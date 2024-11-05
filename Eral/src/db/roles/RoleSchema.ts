import { Document, Schema, SchemaTypes, model } from "mongoose";

export interface IRole {
    guildId: string,
    userId: string,

    roles: string[]
}

export type TRole = IRole & Document

export default model(
    'Role',
    new Schema<IRole>(
        {
            guildId: { type: SchemaTypes.String, required: true },
            userId: { type: SchemaTypes.String, required: true },

            roles: { type: [], default: [] }
        }
    ),
    'roles'
)