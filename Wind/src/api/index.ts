import { rateLimit } from "express-rate-limit";
import { Collection } from "discord.js";
import { WebSocketServer } from "ws";
import { v4 as uuid } from "uuid";
import { readdir } from "fs";
import BaseRoute from "./base/BaseRoute";
import WindClient from "#client";
import cors from "cors";
import express, {
    Express,
    Request,
    Response,
} from "express";

export default class WindApi {
    public ip: string = process.platform === 'linux' ? this.client.config.ip : 'localhost'
    public readonly ws: WebSocketServer = new WebSocketServer({ port: this.client.config.ws.port })
    public readonly connections: Collection<string, any> = new Collection()
    private readonly password: string = 'ebalo'
    public readonly app: Express = express()
    private readonly port: number = 3001

    constructor(
        public client: WindClient
    ) {
        this.app.use(cors())
        this.app.use(express.urlencoded({ extended: false }))
        this.app.use(express.json({ limit: "1000000mb" }))
        this.app.use(
            rateLimit(
                {
                    windowMs: 5 * 60 * 1000,
                    limit: 100
                }
            )
        )

        this.loadRoutes()

        this.app.get('/', (req, res) => this.getDefaultRoute(req, res))

        this.app.listen(this.port, () => {
            client.logger.apiConnect(this.ip, this.port)
        })

        this.ws.on('listening', () => {
            client.logger.wsConnect(this.ip, this.port)
        })

        this.ws.on('connection', (ws) => {
            ws.send(JSON.stringify({ method: 'who' }))
            ws.on('message', (data: any) => {
                try {
                    const parse = JSON.parse(data)
                    switch(parse.method) {
                        case 'getWho':
                            if(!parse?.who) return
                            return this.connections.set(
                                `${parse.who}-${uuid()}`,
                                ws
                            )
                    }
                } catch (err) {
                    return
                }
            })
        })
    }

    loadRoutes(dir: string = __dirname) {
        readdir(dir, async (err, files) => {
            if(err || files.length === 0) return

            const routes = files.filter((f) => Boolean(f.split('.')[1]) && !f.startsWith('index'))
            const dirs = files.filter((f) => !Boolean(f.split('.')[1]) && !['base', 'service'].includes(f))

            for ( let i = 0; dirs.length > i; i++ ) {
                this.loadRoutes(`${dir}/${dirs[i]}`)
            }

            for ( let i = 0; routes.length > i; i++ ) {
                const route = new ((await import(`${dir}/${routes[i]}`))?.default)() as BaseRoute
                if(route && route instanceof BaseRoute) {
                    route.methods.map((r) => {
                        const path = dir.split('api')[1] + `/${route.path}` + (r?.path || '')

                        switch(r.method) {
                            case 'Get':
                                this.app.get(path, (req, res) => {
                                    return r.run(this, req, res)
                                })
                                break
                            case 'Post':
                                this.app.post(path, (req, res) => {
                                    return r.run(this, req, res)
                                })
                                break
                            case 'Put':
                                this.app.put(path, (req, res) => {
                                    return r.run(this, req, res)
                                })
                                break
                            case 'Delete':
                                this.app.delete(path, (req, res) => {
                                    return r.run(this, req, res)
                                })
                                break    
                        }
                    })
                }
            }
        })
    }

    buildSuccess(message: string, result?: any) {
        return { ok: true, status: 200, message, result }
    }

    buildError(message: string, status: number = 505) {
        return { ok: false, status, message }
    }

    getAuth(req: Request) {
        if(!req.headers?.authorization) {
            return this.buildError(
                'No auth',
                404
            )
        }

        if(req.headers.authorization !== this.password) {
            return this.buildError(
                'Invalid password',
                403
            )
        }

        return false
    }

    private getDefaultRoute(req: Request, res: Response) {
        return res.send(this.buildSuccess('Api is worked!'))
    }
}