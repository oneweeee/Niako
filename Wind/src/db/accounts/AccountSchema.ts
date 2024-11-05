import { Schema, Document, model } from "mongoose"

export interface IAccount {
    userId: string,
    token: string,
    accessToken: string,
    favoriteGuilds: string[]
}

export type TAccount = IAccount & Document

export default model<IAccount>(
    'Account',
    new Schema(
        {
            userId: { type: Schema.Types.String, required: true },
            token: { type: Schema.Types.String, default: '' },
            accessToken: { type: Schema.Types.String, default: '' },
            favoriteGuilds: { type: [], default: [] }
        }
    )
)