import { Document, Schema, SchemaTypes, model } from "mongoose";

export interface ITransaction {
    date: number,
    type: 'ReplenishmentBalance' | 'BuyingBoosts' | 'ProlongBoost' | 'DevPanelAddBalance' | 'DevPanelRemoveBalance',
    count: number,
    state: boolean,
    options?: { boosts?: number, userId?: string }
}

export interface IAccount {
    userId: string,

    balance: number,
    transactions: ITransaction[],
    qiwiBillId: string
}

export type TAccount = IAccount & Document

export const AccountSchema =  model<IAccount>(
    'Account',
    new Schema<IAccount>(
        {
            userId: { type: SchemaTypes.String, required: true },

            balance: { type: SchemaTypes.Number, default: 0 },
            transactions: { type: [], default: [] },
            qiwiBillId: { type: SchemaTypes.String, default: 'No' },
        }
    ),
    'accounts'
)