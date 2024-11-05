import BaseInteraction, { InteractionModalRun } from "../base/BaseInteraction"
import { Collection, Interaction } from "discord.js"
import BaseWatcher from "../base/BaseWatcher"
import WindClient from "../WindClient"
import { readdir } from "fs"

export default class ModalWatcher extends BaseWatcher {
    private readonly dir: string = `${__dirname}/../../app/Modals`
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
                const modal = (await import(`${dir}/${files[i]}`))
                if(modal?.default && modal.default instanceof BaseInteraction) {
                    this.addInteraction(modal.default)
                } else {
                    this.client.logger.error(`Error loaded Modal file "${files[i]}"...`)
                }
            }
        })
    }

    addInteraction(file: BaseInteraction) {
        if(file.options?.disabled) return

        if(this.cache.has(file.options.name)) {
            return this.client.logger.error(`Modal file "${file.options.name}" is loaded!`)
        }

        return this.cache.set(file.options.name, file)
    }

    async parseInteraction(interaction: Interaction<'cached'>) {
        if(!interaction.isModalSubmit()) return

        const modal = this.client.util.getModal(interaction.customId)
        if(!modal) return

        return (modal.exec as InteractionModalRun)(this.client, interaction, this.client.db.guilds.getLocale(interaction.guild)).catch(() => {})
    }
}