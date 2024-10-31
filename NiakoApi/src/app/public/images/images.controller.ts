import { Controller, Get, Post, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ImagesService } from "./images.service";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import BaseController from "../../../struct/BaseController";

@ApiTags('Niako Images', 'Public Methods')
@Controller('public/images')
export class ImagesController extends BaseController {
    constructor(private readonly service: ImagesService) { super() }

    @Get('reactions')
    getAllReaction() {
        return this.sendSuccess({ answer: this.service.getAllReactionUrl() })
    }

    @Get('reaction/:type')
    getReaction(@Req() req: Request) {
        const type = req.params.type
        if(!type) {
            return this.sendError(400, { message: 'No query type' })
        }

        if(typeof type !== 'string') {
            return this.sendError(400, { message: 'Type is not string' })
        }

        return this.sendSuccess({ answer: this.service.getReactionUrl(type) })
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    post(@UploadedFile() file: any, @Req() req: Request) {
        if(!file) {
            return this.sendError(400, { message: 'No file' })
        }

        return this.sendSuccess({ answer: this.service.generateImageLink(file.filename, 'banner') })
    }
}