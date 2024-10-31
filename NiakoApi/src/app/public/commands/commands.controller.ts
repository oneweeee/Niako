import { Controller, Get, Post, Req } from "@nestjs/common";
import { Request } from "express";
import { ApiTags } from "@nestjs/swagger";
import BaseController from "../../../struct/BaseController";

@ApiTags('Niako Commands', 'Public Methods')
@Controller('public/commands')
export class CommandsController extends BaseController {
    private commands: any[] = []

    @Get()
    get() {
        return this.commands
    }

    @Post()
    post(@Req() req: Request) {
        const checkAuth = this.checkAuth(req)
        if(checkAuth) return checkAuth

        const res = req.body
        if(typeof res?.commands !== 'string') {
            return this.sendError(400, { message: 'No commands' })
        }

        const newCommands = this.toObject(res.commands)
        if(typeof newCommands === 'string') {
            return this.sendError(400, { message: 'Invalid commands object' })
        }

        this.commands = newCommands

        return this.sendSuccess({ message: 'Commands recorded' })
    }
}