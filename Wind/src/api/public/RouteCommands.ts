import BaseRoute from "../base/BaseRoute";

export default class RouteCommands extends BaseRoute {
    constructor() {
        super(
            'commands',
            [
                {
                    method: 'Get',
                    run: async (api, req, res) => {
                        return res.send(
                            api.buildSuccess(
                                'Success get commands!',
                                api.client.watchers.slashCommands.cache.map((c) => c.options)
                            )
                        )
                    }
                }
            ]
        )
    }
}