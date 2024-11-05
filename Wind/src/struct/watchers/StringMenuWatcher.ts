import BaseInteraction, { InteractionStringMenuRun } from "../base/BaseInteraction"
import { Collection, Interaction } from "discord.js"
import BaseWatcher from "../base/BaseWatcher"
import WindClient from "../WindClient"
import { readdir } from "fs"

export default class StringMenuWatcher extends BaseWatcher {
    private readonly dir: string = `${__dirname}/../../app/Menus String`
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
                const StringMenu = (await import(`${dir}/${files[i]}`))
                if(StringMenu?.default && StringMenu.default instanceof BaseInteraction) {
                    this.addInteraction(StringMenu.default)
                } else {
                    this.client.logger.error(`Error loaded String Menu file "${files[i]}"...`)
                }
            }
        })
    }

    addInteraction(file: BaseInteraction) {
        if(file.options?.disabled) return

        if(this.cache.has(file.options.name)) {
            return this.client.logger.error(`String Menu file "${file.options.name}" is loaded!`)
        }

        return this.cache.set(file.options.name, file)
    }

    async parseInteraction(interaction: Interaction<'cached'>) {
        if(!interaction.isStringSelectMenu()) return

        const StringMenu = this.client.util.getStringSelectMenu(interaction.customId)
        if(!StringMenu) return

        return (StringMenu.exec as InteractionStringMenuRun)(this.client, interaction, this.client.db.guilds.getLocale(interaction.guild)).catch(() => {})
    }
}