import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseEvent from "../../../struct/base/BaseEvent";

export default new BaseEvent(
    {
        name: 'error'
    },
    async (client: NiakoClient, error: Error) => {
        client.logger.error(error)
        if(String(error) === '{}') return
        
        return client.request.error(error)
    }
)