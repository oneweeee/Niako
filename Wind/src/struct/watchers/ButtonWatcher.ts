import BaseInteraction, { InteractionButtonRun } from "../base/BaseInteraction"
import { Collection, Interaction } from "discord.js"
import BaseWatcher from "../base/BaseWatcher"
import WindClient from "../WindClient"
import { readdir } from "fs"

export default class ButtonWatcher extends BaseWatcher {
    private readonly dir: string = `${__dirname}/../../app/Buttons`
    public cache: Collection<string, BaseInteraction> = new Collection()

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
                const Button = (await import(`${dir}/${files[i]}`))
                if(Button?.default && Button.default instanceof BaseInteraction) {
                    this.addInteraction(Button.default)
                } else {
                    this.client.logger.error(`Error loaded Button file "${files[i]}"...`)
                }
            }
        })
    }

    addInteraction(file: BaseInteraction) {
        if(file.options?.disabled) return

        if(this.cache.has(file.options.name)) {
            return this.client.logger.error(`Button file "${file.options.name}" is loaded!`)
        }

        return this.cache.set(file.options.name, file)
    }

    async parseInteraction(interaction: Interaction<'cached'>) {
        if(!interaction.isButton()) return

        const button = this.client.util.getButton(interaction.customId)
        if(!button) return

        return (button.exec as InteractionButtonRun)(this.client, interaction, this.client.db.guilds.getLocale(interaction.guild)).catch(() => {})
    }
}