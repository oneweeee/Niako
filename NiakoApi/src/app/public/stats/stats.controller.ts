import { Controller, Get, Post, Put, Req } from "@nestjs/common";
import { IStatsAnswer } from "../../../types/public/stats";
import { StatsService } from "./stats.service";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import BaseController from "../../../struct/BaseController";

@ApiTags('Niako Statistics', 'Public Methods')
@Controller('public/stats')
export class StatsController extends BaseController {
    constructor(private readonly service: StatsService) { super() }

    @Get()
    get(): IStatsAnswer {
        return this.service.getStats()
    }

    @Post()
    post(@Req() req: Request) {
        const checkAuth = this.checkAuth(req)
        if(checkAuth) return checkAuth

        const res = req.body
        if(!res.clusterId && !res.shards) {
            return this.sendError(400, { message: 'No cluster Id' })
        }

        this.service.recordActivity(res)

        return this.sendSuccess({ message: 'Shard activity recorded' })
    }

    @Put()
    put(@Req() req: Request) {
        const checkAuth = this.checkAuth(req)
        if(checkAuth) return checkAuth

        const res = req.body
        if(typeof res?.clusterId !== 'number') {
            return this.sendError(400, { message: 'No cluster Id' })
        }

        this.service.recordStats(res)

        return this.sendSuccess({ message: 'Shard stats recorded' })
    }
}