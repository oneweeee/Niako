import { Module } from "@nestjs/common";
import { GuildsController } from "./guilds.controller";
import { GuildsService } from "./guilds.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ModuleBanner, ModuleBannerSchema } from "./dto/module_banner.dto";
import { ModuleVoice, ModuleVoiceSchema } from "./dto/module_voice.dto";
import { ModuleAudit, ModuleAuditSchema } from "./dto/module_audit.dto";
import { Badge, BadgeSchema } from "./dto/badges.dto";
import { Boost, BoostSchema } from "./dto/boosts.dto";

@Module(
    {
        controllers: [ GuildsController ],
        providers: [ GuildsService ],
        imports: [
            MongooseModule.forFeature(
                [
                    { name: ModuleBanner.name, schema: ModuleBannerSchema },
                    { name: ModuleVoice.name, schema: ModuleVoiceSchema },
                    { name: ModuleAudit.name, schema: ModuleAuditSchema },
                    { name: Badge.name, schema: BadgeSchema },
                    { name: Boost.name, schema: BoostSchema }
                ]
            )
        ]
    }
)
export class GuildsModule {}