import WindClient from "../WindClient"
import { Message } from "discord.js"

interface MessageCommandData {
    name: string,
    description?: string,
    disabled?: boolean,
    aliases?: string[],
    dev?: boolean,
    options?: []
}

export default class BaseMessageCommand {
    constructor(
        public readonly options: MessageCommandData,
        public exec: (client: WindClient, message: Message<true>, args: string[]) => Promise<any>
    ) {}
}