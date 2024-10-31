import { Document, Schema, SchemaTypes, model } from "mongoose";

export interface IBoost {
    _id: Schema.Types.ObjectId

    guildId: string,
    userId: string,
    
    actived: boolean,
    activedTimestamp: number,
    boosted: boolean,
    boostedTimestamp: number,
    bought: number,
    end: number,

    new: boolean,
    gift: boolean
}

export interface IGuildBoost {
    level: number,
    boosts: IBoost[]
}

export type TBoost = IBoost & Document

export const BoostSchema =  model<IBoost>(
    'Boost',
    new Schema<IBoost>(
        {
            userId: { type: SchemaTypes.String, required: true },

            guildId: { type: SchemaTypes.String, default: '0' },
            actived: { type: SchemaTypes.Boolean, default: false },
            activedTimestamp: { type: SchemaTypes.Number, default: 0 },
            boosted: { type: SchemaTypes.Boolean, default: false },
            boostedTimestamp: { type: SchemaTypes.Number, default: 0 },
            bought: { type: SchemaTypes.Number, default: Date.now() },
            end: { type: SchemaTypes.Number, default: 0 },

            new: { type: SchemaTypes.Boolean, default: false },
            gift: { type: SchemaTypes.Boolean, default: false }
        }
    ),
    'boosts'
)