import { HttpException, HttpStatus, Injectable, NestMiddleware, Req } from "@nestjs/common";
import { NextFunction, Request } from "express";
import * as config from '../../../config';

@Injectable()
export class UploadMiddleware implements NestMiddleware {
    private readonly cl: Map<string, number> = new Map()

    constructor() {
        setInterval( () => {
            this.cl.forEach((timer, id) => {
                if(timer < (Date.now() - config.uploadOptions.cooldown / config.uploadOptions.count)) {
                    this.cl.delete(id)
                }
            })
        }, config.uploadOptions.cooldown)
    }

    async use(@Req() req: Request, res: any, next: NextFunction) {
        if(!req.headers.authorization) {
            throw new HttpException(`Unauthorized`, HttpStatus.UNAUTHORIZED);
        }

        const check = this.checkCooldown(req.headers.authorization)

        if(!check.state) {
            throw new HttpException(`You can upload new file in ${check.time}`, HttpStatus.TOO_MANY_REQUESTS);
        }
    
        next()
    }

    private checkCooldown(id: string) {
        if(!this.cl.has(id)) {
            this.cl.set(id, Date.now())
            return {
                state: true
            }
        }
    
        const cd = this.cl.get(id)!
    
        if(cd > (Date.now() + config.uploadOptions.cooldown)) {
            return {
                state: false,
                time: ((cd - Date.now() - config.uploadOptions.cooldown) / 1000) + 's'
            }
        }
    
        this.cl.set(id, cd + config.uploadOptions.cooldown / config.uploadOptions.count)
    
        return {
            state: true
        }
    }
}