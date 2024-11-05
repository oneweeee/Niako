import UserService from "./service/UserService";
import BaseRoute from "../base/BaseRoute";

export default class GetCommands extends BaseRoute {
    private readonly service = new UserService()

    constructor() {
        super(
            'user',
            [
                {
                    path: '/auth',
                    method: 'Post',
                    run: async (api, req, res) => {
                        if(!req.body?.code || !req.body?.redirect_uri) {
                            return res.send(api.buildError('No code and redirect_uri', 400))
                        }

                        const data = await this.service.authorization(api, req.body.code, req.body.redirect_uri)
                        if(typeof data === 'string') {
                            return res.send(api.buildError(data, 500))
                        }

                        this.service.sendWebsiteLog(api, `[${data.firstLogin ? '<:W_StatusRestart:1188159120914788434>' : '<:W_StatusConnect:1188148383437824110>'}] ${this.service.getUsername(data.cookie)} logged in to the website`)

                        return res.send(api.buildSuccess('User is login', data.cookie))
                    }
                },
                {
                    path: '/token',
                    method: 'Put',
                    run: async (api, req, res) => {
                        const token = req.headers?.authorization
                        if(!token) {
                            return res.send(api.buildError('Unauthorized', 400))
                        }

                        const account = await api.client.db.accounts.getToken(token)
                        if(!account) {
                            return res.send(api.buildError('Invalid token', 404))
                        }

                        const data = await this.service.getUserInfo(api, account.accessToken)
                        if(typeof data === 'string') {
                            return res.send(api.buildError(data, 500))
                        }

                        this.service.sendWebsiteLog(api, `[<:W_StatusWarn:1188148305058873424>] ${this.service.getUsername(data.user)} went to the website`)

                        return res.send(api.buildSuccess('Token is available', this.service.generateUserCookie(data.doc, data.user)))
                    }
                },
                {
                    path: '/token',
                    method: 'Delete',
                    run: async (api, req, res) => {
                        const token = req.headers?.authorization
                        if(!token) {
                            return res.send(api.buildError('Unauthorized', 400))
                        }

                        /*const data = await this.service.delete(api, token)
                        if(typeof data === 'string') {
                            return res.send(api.buildError(data, 500))
                        }*/

                        if(Object.keys(req.body).length > 1) {
                            this.service.sendWebsiteLog(api, `[<:W_StatusError:1188149028903460966>] ${this.service.getUsername(req.body)} left the website`)
                        }

                        return res.send(api.buildSuccess('User unlogin'))
                    }
                }
            ]
        )
    }
}