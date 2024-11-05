import { AutocompleteInteraction, Collection, CommandInteraction } from "discord.js";
import { readdir } from "fs";
import BaseSlashCommand from "../base/BaseSlashCommand";
import Client from "../client/Client";

export default class SlashCommandHandler {
    private readonly dir: string = `${__dirname}/../../app/Slash Commands`
    readonly cache: Collection<string, BaseSlashCommand> = new Collection()

    constructor(
        private client: Client
    ) {}

    load() {
        readdir(this.dir, (err, dirs) => {
            if(err) return  //this.client.logger.error(err)

            dirs.filter(d => d.split('.').length === 1)
            .forEach((dir) => {
                readdir(`${this.dir}/${dir}`, (err, files) => {
                    if(err) return  //this.client.logger.error(err)

                    files.filter((f) => ['js', 'ts'].includes(f.split('.')[1]))
                    .forEach(async (file) => {
                        const slash = (await import(`${this.dir}/${dir}/${file}`))
                        if(slash?.default && slash.default instanceof BaseSlashCommand) {
                            return this.add(slash.default as BaseSlashCommand)
                        } else {
                            return this.client.logger.error(`Error loaded Slash Command file "${file}" in dir "${dir}...`)
                        }
                    })
                })
            })
        })
    }

    add(slash: BaseSlashCommand) {
        if(this.cache.has(slash.name)) {
            return this.client.logger.error(`Slash Command ${slash.name} is loaded!`)
        }

        return this.cache.set(slash.name, slash)
    }

    remove(name: string) {
        if(!this.cache.has(name)) {
            return this.client.logger.error(`Slash Command ${name} is not loaded!`)
        }

        return this.cache.delete(name)
    }

    async parseInteraction(interaction: CommandInteraction<'cached'>, interactionCached: number) {
        const slash = this.client.util.getSlashCommand(interaction.commandName)

        if(slash) {
            if(
                slash.options.onlyMod && !this.client.config.owners.map((o) => o.id).includes(interaction.user.id)
                && !interaction.member.permissions.has('Administrator') && !interaction.member.roles.cache.has(this.client.config.meta.moderatorId)
            ) {
                return interaction.reply({ content: 'Данная **команда** Вам **недоступна**', ephemeral: true })
            }

            return slash.run(this.client, interaction)
        } else {
            if(!interaction.deferred && !interaction.replied) {
                return interaction.reply({ content: 'нет такой команды', ephemeral: true })
            }
        }
    }

    parseAutocomplete(interaction: AutocompleteInteraction<'cached'>) {
        const slash = this.client.util.getSlashCommand(interaction.commandName)

        if(slash && slash?.autocomplete) {
            return slash.autocomplete(this.client, interaction)
        }
    }

    async initGlobalApplicationCommands() {
        //const commands = this.cache.filter((s) => s.options?.global).map((s) => s.options)
        const commands = this.cache.map((s) => s.options)
        if(commands.length === 0) {
            if((this.client.application!.commands.cache.size || 0) > 0) {
                return this.client.application.commands.set([])
            }

            return
        }
        
        return (await this.client.application.commands.set(commands))
    }

    /*async initGuildApplicationCommands() {
        const commands = this.cache.filter((s) => !s.options?.global).map((s) => s.options)
        if(commands.length === 0) return

        const guilds = this.client.guilds.cache.map((g) => g)

        for ( const guild of guilds) {
            await guild.commands.set(commands)
        }
    }

    initCommands(guild: Guild) {
        return guild.commands.set(this.cache.filter((s) => !s.options?.global).map((s) => s.options))
    }*/
}