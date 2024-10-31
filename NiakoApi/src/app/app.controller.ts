import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiTags } from "@nestjs/swagger";
import BaseController from "../struct/BaseController";

@ApiTags('Util', 'Public Methods')
@Controller()
export class AppController extends BaseController {
    constructor(private readonly service: AppService) { super() }

    @Get()
    get() {
        return this.sendSuccess({ message: this.service.get() })
    }
}