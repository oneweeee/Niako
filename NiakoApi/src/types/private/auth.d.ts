import { Document } from 'mongoose';

export interface IAuthDto {
    id: string,
    access_token: string,
    refresh_token: string,
    expires_in: number,
    jwt_token: string
}

export type TAuthDocument = Document & IAuthDto