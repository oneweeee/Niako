import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseEvent from "../../../struct/base/BaseEvent";

export default new BaseEvent(
    {
        name: 'warn',
        disabled: true
    },
    async (client: NiakoClient, info: string) => {
        return client.logger.log(info)
    }
)