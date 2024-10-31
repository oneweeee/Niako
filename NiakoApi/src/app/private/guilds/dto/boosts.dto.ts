import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface IBoostDto {
    guildId: string
}

export type TBoostDocument = IBoostDto & Document

@Schema()
export class Boost {
    @Prop({ required: true })
    guildId: string
}

export const BoostSchema = SchemaFactory.createForClass<IBoostDto>(Boost)