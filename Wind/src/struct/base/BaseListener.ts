import { ClientEvents } from "discord.js"
import WindClient from "../WindClient"

export default class BaseListener {
    constructor(
        public readonly options: { name: keyof ClientEvents | string, once?: boolean, disabled?: boolean },
        public exec: (client: WindClient, ...arg1: any[]) => Promise<any>
    ) {}
}