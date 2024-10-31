import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common';
import { NecordModule } from 'necord';
import { PrivateModule } from './private/private.module';
import { PublicModule } from './public/public.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { mongoUrl, supportToken } from '../config';

@Module(
    {
        controllers: [ AppController ],
        providers: [ AppService ],
        imports: [
            PublicModule,
            PrivateModule,
            MongooseModule.forRoot(
                mongoUrl
            ),
            NecordModule.forRoot({
                token: supportToken,
                intents: 131071
            })
        ]
    }
)
export class AppModule {}