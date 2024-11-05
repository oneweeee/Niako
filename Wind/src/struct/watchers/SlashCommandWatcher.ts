import { Collection, Interaction } from "discord.js"
import BaseSlashCommand from "../base/BaseSlashCommand"
import BaseWatcher from "../base/BaseWatcher"
import WindClient from "../WindClient"
import { readdir } from "fs"

export default class SlashCommandWatcher extends BaseWatcher {
    private readonly dir: string = `${__dirname}/../../app/Slash Commands`
    public cache: Collection<string, BaseSlashCommand> = new Collection()
    public categorys: Set<string> = new Set()

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
                const SlashCommand = (await import(`${dir}/${files[i]}`))
                if(SlashCommand?.default && SlashCommand.default instanceof BaseSlashCommand) {
                    this.addSlashCommand(SlashCommand.default)
                } else {
                    this.client.logger.error(`Error loaded BaseSlashCommand file "${files[i]}"...`)
                }
            }
        })
    }

    addSlashCommand(file: BaseSlashCommand) {
        if(file.options?.disabled) return

        if(this.cache.has(file.options.name)) {
            return this.client.logger.error(`BaseSlashCommand file "${file.options.name}" is loaded!`)
        }

        if(!this.categorys.has(file.options.category)) {
            this.categorys.add(file.options.category)
        }

        return this.cache.set(file.options.name, file)
    }

    async parseInteraction(interaction: Interaction<'cached'>, interactionCached: number) {
        if(!interaction.isCommand()) return

        const slashCommand = this.client.util.getSlashCommand(interaction.commandName)
        if(!slashCommand) return

        return slashCommand.exec(this.client, interaction, { interactionCached, locale: this.client.db.guilds.getLocale(interaction.guild) }).catch(() => {})
    }

    async parseAutocomplete(interaction: Interaction<'cached'>) {
        if(!interaction.isAutocomplete()) return

        const slashCommand = this.client.util.getSlashCommand(interaction.commandName)
        if(!slashCommand || !slashCommand?.autoComplete) return

        return slashCommand.autoComplete(this.client, interaction).catch(() => {})
    }
}