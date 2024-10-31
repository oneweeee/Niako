import { Injectable } from "@nestjs/common";
import { readdirSync } from "fs";
import BaseService from "../../../struct/BaseService";

@Injectable()
export class ImagesService extends BaseService {
    getAllReactionUrl() {
        return this.getAllFileReaction().map((file) => ({ url: this.generateImageLink(file, 'reaction'), file: file }))
    }

    getReactionUrl(type: string) {
        const reactions = this.getAllFileReaction()
        const filter = reactions.filter((url) => url.startsWith(type))
        if(filter.length === 0) return this.generateImageLink('404.gif', 'reaction')

        return this.generateImageLink(this.randomElement(filter), 'reaction')
    }

    private getAllFileReaction() {
        return readdirSync(`${__dirname}/../../../../assets/reaction`)
    }
}