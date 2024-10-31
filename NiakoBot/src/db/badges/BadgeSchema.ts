import { Document, Schema, SchemaTypes, model } from "mongoose";

export type TBadges = 'NiakoEarlySupport' | 'NiakoPartner'

export interface IBadge {
    guildId: string,
    userId: string,
    type: 'Guild' | 'User',
    badge: TBadges
}

export type TBadge = IBadge & Document

export const BadgeSchema =  model<IBadge>(
    'Badge',
    new Schema<IBadge>(
        {
            type: { type: SchemaTypes.String, required: true },
            badge: { type: SchemaTypes.String, required: true },

            guildId: { type: SchemaTypes.String, default: '0' },
            userId: { type: SchemaTypes.String, default: '0' }
        }
    ),
    'badges'
)