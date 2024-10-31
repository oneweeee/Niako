import { Module } from '@nestjs/common';
import { CommandsModule } from './commands/commands.module';
import { StatsModule } from './stats/stats.module';
import { ImagesModule } from './images/images.module';

@Module(
    {
        imports: [
            StatsModule,
            ImagesModule,
            CommandsModule
        ]
    }
)
export class PublicModule {}