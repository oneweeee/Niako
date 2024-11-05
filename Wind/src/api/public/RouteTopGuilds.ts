import GuildsService from "./service/GuildsService";
import BaseRoute from "../base/BaseRoute";

export default class RouteTopGuilds extends BaseRoute {
    private readonly service = new GuildsService()

    constructor() {
        super(
            'top-guilds',
            [
                {
                    method: 'Get',
                    run: async (api, req, res) => {
                        return res.send(
                            api.buildSuccess(
                                'Success get guilds!',
                                this.service.get()
                            )
                        )
                    }
                },
                {
                    method: 'Post',
                    run: async (api, req, res) => {
                        const auth = api.getAuth(req)
                        if(auth) {
                            return res.send(auth)
                        }

                        if(!req?.body?.length) {
                            return api.buildError('No have body')
                        }

                        const get = this.service.post(req.body)
        
                        return res.send(
                            api.buildSuccess(
                                'Success post guilds!',
                                get
                            )
                        )
                    } 
                }
            ]
        )
    }
}