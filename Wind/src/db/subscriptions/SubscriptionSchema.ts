import {
    Schema,
    SchemaTypes,
    Document,
    model
} from "mongoose"

export interface ISubscription {
    _id: Schema.Types.ObjectId
    
    userId: string,
    guildId: string,

    actived: boolean,
    activedTimestamp: number,

    boughtTimestamp: number
    endTimestamp: number
}

export type TSubscription = ISubscription & Document

export default model<ISubscription>(
    'Subscription',
    new Schema(
        {
            userId: { type: SchemaTypes.String, required: true },
            guildId: { type: SchemaTypes.String, default: '' },

            actived: { type: SchemaTypes.Boolean, default: false },
            activedTimestamp: { type: SchemaTypes.Number, default: 0 },

            boughtTimestamp: { type: SchemaTypes.Number, default: Date.now() },
            endTimestamp: { type: SchemaTypes.Number, default: 0 }
        }
    ),
    'subscription'
)