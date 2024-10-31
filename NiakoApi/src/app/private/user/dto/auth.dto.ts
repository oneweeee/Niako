import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IAuthDto } from '../../../../types/private/auth';

@Schema()
export class Auth {
    @Prop()
    id: string

    @Prop()
    access_token: string

    @Prop({ default: 'None' })
    refresh_token: string

    @Prop({ default: 0 })
    expires_in: number

    @Prop({ default: 'None' })
    jwt_token: string
}

export const AuthSchema = SchemaFactory.createForClass<IAuthDto>(Auth)