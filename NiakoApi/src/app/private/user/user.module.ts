import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from './dto/auth.dto';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module(
    {
        controllers: [ UserController ],
        providers: [ UserService ],
        imports: [
            MongooseModule.forFeature(
                [
                    { name: Auth.name, schema: AuthSchema }
                ]
            )
        ]
    }
)
export class AuthModule {}