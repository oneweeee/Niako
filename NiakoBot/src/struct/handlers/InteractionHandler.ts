import { NiakoClient } from "../client/NiakoClient";
import { readdir } from "fs";
import BaseInteraction, {
    TButtonInteractionRun,
    TChannelSelectInteractionRun,
    TModalInteractionRun,
    TStringSelectInteractionRun,
    TUserSelectInteractionRun
} from "../base/BaseInteraction";
import {
    ButtonInteraction,
    ChannelSelectMenuInteraction,
    Collection, Interaction,
    ModalSubmitInteraction,
    StringSelectMenuInteraction,
    UserSelectMenuInteraction
} from "discord.js";

export default class InteractionHandler {
    readonly cache: Collection<string, BaseInteraction> = new Collection()
    private dir: string = `${__dirname}/../../app`

    constructor(
        private client: NiakoClient,
        public readonly type: 'Buttons' | 'Modals' | 'Menus String' | 'Menus User' | 'Menus Channel'
    ) {
        this.dir += `/${type}`
    }

    async load() {
        readdir(this.dir, (err, dirs) => {
            if(err) return

            dirs = dirs.filter(d => d.split('.').length === 1)
            for ( let i = 0; dirs.length > i; i++ ) {
                readdir(`${this.dir}/${dirs[i]}`, async (err, files) => {
                    if(err) return this.client.logger.error(err)

                    files = files.filter((f) => ['js', 'ts'].includes(f.split('.')[1]))
                    for ( let j = 0; files.length > j; j++ ) {
                        const int = (await import(`${this.dir}/${dirs[i]}/${files[j]}`))
                        if(int?.default && int.default instanceof BaseInteraction) {
                            this.add(int.default as BaseInteraction)
                        } else {
                            this.client.logger.error(`Error loaded ${this.type} file "${files[j]}" in dir "${dirs[i]}...`)
                        }
                    }
                })
            }
        })
    }

    add(int: BaseInteraction) {
        if(this.cache.has(int.name)) {
            return this.client.logger.error(`${this.type} ${int.name} is loaded!`)
        }

        return this.cache.set(int.name, int)
    }

    remove(name: string) {
        if(!this.cache.has(name)) {
            return this.client.logger.error(`${this.type} ${name} is not loaded!`)
        }

        return this.cache.delete(name)
    }

    private checkInteractionOptions(interaction: Interaction<'cached'>, cache: BaseInteraction) {
        if(cache.options?.onlyOwner) {
            const owners = this.client.config.owners.map((o) => o.id)
            if(!owners.includes(interaction.user.id)) {
                return
            }
        }
    }

    parseButtonInteraction(interaction: ButtonInteraction<'cached'>) {
        const button = this.client.util.getButton(interaction.customId)
        
        if(button) {
            this.checkInteractionOptions(interaction, button)
            return (button.run as TButtonInteractionRun)(this.client, interaction, interaction.guild.preferredLocale).catch(() => {})
        }
    }

    parseModalInteraction(interaction: ModalSubmitInteraction<'cached'>) {
        const modal = this.client.util.getModal(interaction.customId)

        if(modal) {
            this.checkInteractionOptions(interaction, modal)
            return (modal.run as TModalInteractionRun)(this.client, interaction, interaction.guild.preferredLocale).catch(() => {})
        }
    }

    parseChannelMenuInteraction(interaction: ChannelSelectMenuInteraction<'cached'>) {
        const menu = this.client.util.getChannelMenu(interaction.customId)

        if(menu) {
            this.checkInteractionOptions(interaction, menu)
            return (menu.run as TChannelSelectInteractionRun)(this.client, interaction, interaction.guild.preferredLocale).catch(() => {})
        }
    }

    parseStringMenuInteraction(interaction: StringSelectMenuInteraction<'cached'>) {
        const menu = this.client.util.getStringMenu(interaction.customId)

        if(menu) {
            this.checkInteractionOptions(interaction, menu)
            return (menu.run as TStringSelectInteractionRun)(this.client, interaction, interaction.guild.preferredLocale).catch(() => {})
        }
    }

    parseUserMenuInteraction(interaction: UserSelectMenuInteraction<'cached'>) {
        const menu = this.client.util.getUserMenu(interaction.customId)

        if(menu) {
            this.checkInteractionOptions(interaction, menu)
            return (menu.run as TUserSelectInteractionRun)(this.client, interaction, interaction.guild.preferredLocale).catch(() => {})
        }
    }
}