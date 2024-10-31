import { Controller, Post, Req } from "@nestjs/common";
import { ErrorService } from "./error.service";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import BaseController from "../../../struct/BaseController";

@ApiTags('Util', 'Private Methods')
@Controller('private/error')
export class ErrorController extends BaseController {
    constructor(private readonly service: ErrorService) { super() }

    @Post()
    async post(@Req() req: Request) {
        const checkAuth = this.checkAuth(req)
        if(checkAuth) return checkAuth

        await this.service.send(req.body)

        return this.sendSuccess({ message: 'Error sending on guild' })
    }
}