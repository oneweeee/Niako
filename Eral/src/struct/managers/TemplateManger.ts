import { Collection, EmbedBuilder, EmbedData, Message, MessageCreateOptions } from "discord.js";
import Client from "../client/Client";

export type functions = (
    'send' | 'getChannel' | 'createEmbed' | 'if' | 'elseif' | 'else'
)

export interface IResolveFunction {
    messageOption?: boolean,
    embed?: EmbedBuilder
}

export default class TemplateManager {
    constructor(
        private client: Client
    ) {}

    private readonly symbolComment = '#'

    private readonly symbols = [
        '(', ')', '$', this.symbolComment
    ]

    private readonly functions: functions[] = [
        'createEmbed', 'else', 'elseif', 'if', 'getChannel', 'send'
    ]

    createError(message: string) {
        return `❌ **NiakoTemplateError:** ${message}`
    }

    async resolveCode(message: Message, code: string) {
        try {
            const symbols = code.split('')
            if(!this.symbols.some((s) => symbols.includes(s))) {
                return message.channel.send(code)
            }
        
            let createMessageOptions: MessageCreateOptions = { content: undefined, embeds: [], components: [] }
    
            let funcName = ''
            let funcState = false
            let funcOptions = ''
            let funcOptionsState = false
            for ( let i = 0; code.length > i; i++ ) {
                if(funcOptionsState) {
                    funcOptions += code[i]
                }
    
                if(code?.[i-1] === this.symbols[2]) {
                    funcState = true
                }
    
                if(funcState) {
                    funcName += code[i]
                }
    
                if(code?.[i+1] === this.symbols[0]) {
                    funcState = false
                }

                if(code[i] === this.symbols[0]) {
                    funcOptionsState = true
                }
    
                if(code?.[i+1] === this.symbols[1]) {
                    funcOptionsState = false
                }
    
                if((!funcOptionsState && !funcState) && ((funcName !== '' && code[i] === this.symbols[1]) || (funcName !== '' && funcOptions !== ''))) {
                    funcOptions.split(', ')
    
                    const resolveFunction = await this.resolveFunction(funcName, funcOptions)
    
                    if(resolveFunction?.messageOption) {
                        if(resolveFunction.embed) {
                            if(createMessageOptions?.embeds !== undefined) {
                                createMessageOptions.embeds.push(resolveFunction.embed)
                            }
                        }
                    }
    
                    funcName = ''
                    funcOptions = ''
                }
            }
    
            return message.channel.send(createMessageOptions)
        } catch(err: any) {
            return message.channel.send({ content: this.createError(err.message) })
        }
    }

    private async resolveFunction(functionName: string, options: any): Promise<IResolveFunction> {
        switch(functionName) {
            case 'createEmbed':
                options as string
                const symbols = [...this.symbols, ',', "'"]
                const createEmbedOption = {} as any

                const vars: Collection<string, any> = new Collection()
            
                let argument = 0
                let text = ''
                let textState = false

                for ( let i = 0; options.length > i; i++ ) {
                    if(textState) {
                        text += options[i]
                    }

                    if(!textState && options[i+1] && !symbols.includes(options[i+1])) {
                        if(![' ', ','].includes(options[i+1])) {
                            textState = true
                        }
                    } else if(options[i+1] && textState && ![' ', ','].includes(options[i+1]) && !this.isWord(options[i+1])) {
                        switch(argument) {
                            case 0:
                                createEmbedOption.title = text
                                break
                            case 1:
                                createEmbedOption.description = text
                                break
                        }

                        argument += 1
                        text = ''
                        textState = false
                    }
                }

                return this.createEmbed(createEmbedOption)
            default:
                return {}
        }
    }

    private isWord(str: string): boolean {
        return Boolean(str.toUpperCase() !== str.toLowerCase())
    }

    private createEmbed(options: EmbedData = { title: '123' }): IResolveFunction {
        return {
            messageOption: true,
            embed: (new EmbedBuilder(options))
        }
    }
}