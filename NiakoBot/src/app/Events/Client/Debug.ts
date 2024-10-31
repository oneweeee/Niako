import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseEvent from "../../../struct/base/BaseEvent";

export default new BaseEvent(
    {
        name: 'debug'
    },
    async (client: NiakoClient, error: Error) => {
        return client.request.error(error)
    }
)