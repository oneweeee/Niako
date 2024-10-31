import { Module } from '@nestjs/common';
import { AuthModule } from './user/user.module';
import { ErrorModule } from './error/error.module';
import { GuildsModule } from './guilds/guilds.module';

@Module(
    {
        imports: [
            AuthModule,
            ErrorModule,
            GuildsModule
        ]
    }
)
export class PrivateModule {}