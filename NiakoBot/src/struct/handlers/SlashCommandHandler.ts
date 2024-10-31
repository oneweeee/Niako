import { AutocompleteInteraction, Collection, CommandInteraction } from "discord.js";
import BaseSlashCommand from "../base/BaseSlashCommand";
import { NiakoClient } from "../client/NiakoClient";
import { readdir } from "fs";

export default class SlashCommandHandler {
    private readonly dir: string = `${__dirname}/../../app/Slash Commands`
    readonly cache: Collection<string, BaseSlashCommand> = new Collection()

    constructor(
        private client: NiakoClient
    ) {}

    async load() {
        readdir(this.dir, (err, dirs) => {
            if(err) return this.client.logger.error(err)

            dirs = dirs.filter(d => d.split('.').length === 1)
            for ( let i = 0; dirs.length > i; i++ ) {
                
                readdir(`${this.dir}/${dirs[i]}`, async (err, files) => {
                    if(err) return this.client.logger.error(err)

                    files = files.filter((f) => ['js', 'ts'].includes(f.split('.')[1]))
                    for ( let j = 0; files.length > j; j++ ) {
                        const slash = (await import(`${this.dir}/${dirs[i]}/${files[j]}`))
                        if(slash?.default && slash.default instanceof BaseSlashCommand) {
                            this.add(slash.default as BaseSlashCommand)
                        } else {
                            this.client.logger.error(`Error loaded Slash Command file "${files[j]}" in dir "${dirs[i]}...`)
                        }
                    }
                })

            }
        })
    }

    add(slash: BaseSlashCommand) {
        if(this.cache.has(slash.name)) {
            return this.client.logger.error(`Slash Command ${slash.name} is loaded!`)
        }

        if(slash.options?.disabled) return

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
            /*if(slash.options.onlyOwner && !this.client.config.owners.map((o) => o.id).includes(interaction.user.id)) {
                return interaction.reply({ content: this.client.lang.get('system.useWhileDebugging', interaction.guild.preferredLocale), ephemeral: true })
            }

            const doc = await this.client.db.guilds.get(interaction.guildId)
            if(doc.disableCommands.includes(slash.name)) {
                return interaction.reply({ content: 'Данная команда выключена', ephemeral: true })
            }

            if(slash.options?.cooldown) {
                const cd = this.client.cooldown.get(interaction.member, interaction.commandName)
                if(cd && cd > Date.now()) {
                    return interaction.reply({ content: this.client.lang.get('system.cooldownBeforeCommand', interaction.guild.preferredLocale, { cooldown: cd }), ephemeral: true })
                } else {
                    this.client.cooldown.add(interaction.member, slash)
                }
            }*/

            if(slash.options?.needClientPermissions) {
                const me = interaction.guild.members.me || await this.client.util.getMember(interaction.guild, this.client.user.id)
                if(me) {
                    const perms = slash.options.needClientPermissions.filter((p) => !me.permissions.has(p))
                    if(perms.length > 0) {
                        return interaction.reply({ content: `Для **использования** этой команды, мне **необходим${perms.length>1?'ы':'о'}** ${perms.length>1?'эти права:':'право'} ${perms.map((p) => `"\`${p}\`"`).join(', ')}`, ephemeral: true }) //\nДля большего **удобства** выдайте мне право "\`Администратор\`"
                    }
                }
            }

            /*if(slash.options?.voice) {
                const voice = interaction.member?.voice?.channel
                if(!voice) {
                    return interaction.reply({ content: 'Зайдите в голосовой канал для использования', ephemeral: true })
                }
            }*/
            
            return slash.run(
                this.client, interaction, interaction.guild.preferredLocale, { interactionCached }
            ).catch((err): any => {
                console.log(interaction)
                console.log(err)
                this.client.logger.log('-'.repeat(200))
                return interaction.editReply({
                    embeds: [
                        this.client.storage.embeds.error(interaction.member, null, `sdadas`)
                        .setTitle('Неизвестная ошибка')
                        .setDescription(`${this.client.util.toCode(`${err.name}: ${err.message}`, 'js')}\nПри **выполнении** команды произошла **неизвестная** ошибка. Просьба **обратиться** в поддержку за **решением** проблемы.`)
                    ],
                    components: this.client.storage.components.support()
                }).catch(() => {})
            })
        } if(this.client.reactions.commands.get(interaction.commandName)) {
            return this.client.reactions.send(interaction)
        } else {
            if(!interaction.deferred && !interaction.replied) {
                return interaction.reply({ content: this.client.lang.get('system.unknownSlashCommand', interaction.guild.preferredLocale), ephemeral: true }).catch(() => {})
            }
        }
    }

    parseAutocomplete(interaction: AutocompleteInteraction<'cached'>) {
        const slash = this.client.util.getSlashCommand(interaction.commandName)

        if(slash && slash?.autocomplete) {
            return slash.autocomplete(this.client, interaction, interaction.guild.preferredLocale).catch(() => {})
        }
    }

    async initGlobalApplicationCommands() {
        //const commands = this.cache.filter((s) => s.options?.global).map((s) => s.options)
        const commands = this.cache.map((s) => ({ ...s.options, dmPermission: false }))
        if(commands.length === 0) {
            if((this.client.application!.commands.cache.size || 0) > 0) {
                return this.client.application.commands.set([])
            }

            return
        }
        
        return (
            await this.client.application.commands.set(
                [
                    ...commands,
                    ...this.client.reactions.commands.map((c) => ({ ...c, dmPermission: false }))
                ]
            )
        )
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