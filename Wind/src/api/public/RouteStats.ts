import StatsService from "./service/StatsService";
import BaseRoute from "../base/BaseRoute";

export default class RouteStats extends BaseRoute {
    private readonly service = new StatsService()

    constructor() {
        super(
            'stats',
            [
                {
                    method: 'Get',
                    run: async (api, req, res) => {
                        return res.send(
                            api.buildSuccess(
                                'Success get stats!',
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

                        if(!req?.body || !req.body.hasOwnProperty('id')) {
                            return api.buildError('No have body')
                        }

                        this.service.postCluster(req.body.id)
        
                        return res.send(
                            api.buildSuccess(
                                'Success post stats!',
                                this.service.get()
                            )
                        )
                    } 
                },
                {
                    method: 'Put',
                    run: async (api, req, res) => {
                        const auth = api.getAuth(req)
                        if(auth) {
                            return res.send(auth)
                        }

                        if(!req?.body || !req.body.hasOwnProperty('id')) {
                            return api.buildError('No have body')
                        }

                        this.service.putCluster(req.body)
        
                        return res.send(
                            api.buildSuccess(
                                'Success put stats!',
                                this.service.get()
                            )
                        )
                    } 
                }
            ]
        )
    }
}