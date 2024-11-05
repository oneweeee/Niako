import RuslanClient from "../client/Client";

export default class BaseEvent {
    constructor(
        readonly options: { name: string, disabled?: boolean, once?: boolean },
        public run: (client: RuslanClient, ...any: any) => Promise<any>
    ) {}
}