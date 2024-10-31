import { Module } from '@nestjs/common';
import { CommandsController } from './commands.controller';

@Module(
    {
        controllers: [ CommandsController ]
    }
)
export class CommandsModule {}