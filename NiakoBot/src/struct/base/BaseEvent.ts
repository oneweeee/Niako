import { NiakoClient } from "../client/NiakoClient";

export default class BaseEvent {
    constructor(
        readonly options: { name: string, disabled?: boolean, once?: boolean },
        public run: (client: NiakoClient, ...any: any) => Promise<any>
    ) {}
}