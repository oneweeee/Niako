import { Collection, Message } from "discord.js"
import BaseMessageCommand from "../base/BaseMessageCommand"
import BaseWatcher from "../base/BaseWatcher"
import WindClient from "../WindClient"
import { readdir } from "fs"

export default class MessageCommandWatcher extends BaseWatcher {
    private readonly dir: string = `${__dirname}/../../app/Message Commands`
    public cache: Collection<string, BaseMessageCommand> = new Collection()

    constructor(
        private client: WindClient
    ) { super() }

    load(dir: string = this.dir) {
        readdir(dir, async (err, files) => {
            if(err) return

            const dirs = files.filter((file) => this.isDirectory(dir, file))

            for ( let i = 0; files.length > i; i++ ) {
                this.load(`${dir}/${dirs[i]}`)
            }
            
            files = files.filter((file) => this.isFile(dir, file))

            for ( let i = 0; files.length > i; i++ ) {
                const MessageCommand = (await import(`${dir}/${files[i]}`))
                if(MessageCommand?.default && MessageCommand.default instanceof BaseMessageCommand) {
                    this.addMessageCommand(MessageCommand.default)
                } else {
                    this.client.logger.error(`Error loaded BaseMessageCommand file "${files[i]}"...`)
                }
            }
        })
    }

    addMessageCommand(file: BaseMessageCommand) {
        if(file.options?.disabled) return

        if(this.cache.has(file.options.name)) {
            return this.client.logger.error(`BaseMessageCommand file "${file.options.name}" is loaded!`)
        }

        return this.cache.set(file.options.name, file)
    }

    parseMessage(message: Message<true>) {
        const args = message.content.split(' ')
        const prefixs = [`<@!${this.client.user.id}>`, `<@${this.client.user.id}>`, this.client.config.internal.prefix]
        const getPrefix = prefixs.find((prefix) => message.content.startsWith(prefix))
        if(!getPrefix) return

        const commandName = args[0].toLowerCase().slice(getPrefix.length)
        const messageCommand = this.client.util.getMessageCommand(commandName)
        if(!messageCommand) return

        if(messageCommand.options?.dev && !this.client.config.developers.includes(message.author.id)) return

        return messageCommand.exec(this.client, message, args.slice(1))
    }
}