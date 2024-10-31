import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface IBadgeDto {
    guildId: string,
    userId: string,
    type: 'Guild' | 'User',
    badge: 'NiakoEarlySupport' | 'NiakoPartner'
}

export type TBadgeDocument = IBadgeDto & Document

@Schema()
export class Badge {
    @Prop({ default: '0' })
    guildId: string

    @Prop({ default: '0' })
    userId: string

    @Prop({ default: 'Guild' })
    type: 'Guild' | 'User'

    @Prop({ default: 'NiakoPartner' })
    badge: 'NiakoEarlySupport' | 'NiakoPartner'

}

export const BadgeSchema = SchemaFactory.createForClass<IBadgeDto>(Badge)