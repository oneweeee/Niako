import { Collection, EmbedBuilder, EmbedData, Message, MessageCreateOptions } from "discord.js";
import Client from "../client/Client";

export default class TemplateManager {
    constructor(
        private client: Client
    ) {}

    createError(message: string) {
        return `❌ **NiakoTemplateError:** ${message}`
    }

    async resolveCode(message: Message, code: string) {
        const symbolsAll = code.split('')
    
        let createMessageOptions: MessageCreateOptions = { content: undefined, embeds: [], components: [] }
        let content = !code.includes('$nomention') ? message.member!.toString() : ''

        const vars: Collection<string, any> = new Collection()
        const args = message.content.split(' ').splice(0, 1)
        const lines = code.split('\n')

        let returned = false
        for ( let i = 0; lines.length > i; i++ ) {
            const line = lines[i]
            
            let func = ''
            let funcState = false
            let options = ''
            let optionsState = false    
            for ( let j = 0; line.length > j; j++ ) {
                if(line[0] !== '$') {
                    content += line[j]
                } else if(j === 0) {
                    funcState = true
                }

                if(line[j] === ']') {
                    funcState = false
                    optionsState = false
                }

                if(funcState) {
                    func += line[j]
                }

                if(optionsState) {
                    options += line[j]
                }

                if(line?.[j+1] === '[') {
                    funcState = false
                }

                if(line[j] === '[') {
                    optionsState = true
                }
            }

            console.log(func)
            console.log(options)
        }

        if(content !== '') {
            createMessageOptions.content = content
        }

        return message.channel.send(createMessageOptions)
    }
}