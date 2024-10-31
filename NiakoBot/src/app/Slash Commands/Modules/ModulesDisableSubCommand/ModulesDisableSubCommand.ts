import { NiakoClient } from "../../../../struct/client/NiakoClient";
import { CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, lang: string) => {
    /*const doc = await client.db.guilds.get(interaction.guildId)

    const commandName = interaction.options.get('command')?.value as string
    const commandModule = interaction.options.get('category')?.value as string
    let text = ''

    if(!commandModule && !commandName) {
        return interaction.editReply({
            embeds: [ client.storage.embeds.error(interaction.member, 'Выключение модулей', `Вы **не** указали ни один **параметр**`, true) ]
        })
    } else if(commandModule && !commandName) {
        const commands = client.storage.slashCommands.cache.filter((c) => c.options.module === commandModule)
        if(commands.size === 0) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.error(interaction.member, 'Выключение модулей', `Я **не** нашла команды с **такой** категорией`, true) ]
            })
        }

        const resolveCommands = commands.map((c) => c.name).filter((name) => !doc.disableCommands.includes(name) && name !== 'modules')

        if(resolveCommands.length === 0) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.error(interaction.member, 'Выключение модулей', `Все **команды** в этой **категории** выключены`, true) ]
            })
        }

        text = `Вы выключили модуль **${commandModule}**`
        doc.disableCommands.push(...resolveCommands)
    } else if(commandName && !commandModule) {
        const command = client.storage.slashCommands.cache.get(commandName)
        if(!command) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.error(interaction.member, 'Выключение модулей', `Я **не** нашла команду с **таким** названием`, true) ]
            })
        }

        if(command.name === interaction.commandName) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.error(interaction.member, 'Включение модулей', `Вы **не** можете **взаимодействовать** с командой **${interaction.commandName}**`, true) ]
            })
        }

        if(doc.disableCommands.includes(command.name)) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.error(interaction.member, 'Выключение модулей', `Команда **${command.name}** уже выключена`, true) ]
            })
        }

        text = `Вы выключили команду **${command.name}**`
        doc.disableCommands.push(command.name)
    } else {
        const command = client.storage.slashCommands.cache.get(commandName)
        if(!command) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.error(interaction.member, 'Выключение модулей', `Я **не** нашла команду с **таким** названием`, true) ]
            })
        }

        if(command.name === interaction.commandName) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.error(interaction.member, 'Включение модулей', `Вы **не** можете **взаимодействовать** с командой **${interaction.commandName}**`, true) ]
            })
        }

        if(doc.disableCommands.includes(command.name)) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.error(interaction.member, 'Выключение модулей', `Команда **${command.name}** уже выключена`, true) ]
            })
        }

        const commands = client.storage.slashCommands.cache.filter((c) => c.options.module === commandModule)
        if(commands.size === 0) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.error(interaction.member, 'Выключение модулей', `Я **не** нашла команды с **такой** категорией`, true) ]
            })
        }

        const resolveCommands = commands.map((c) => c.name).filter((name) => !doc.disableCommands.includes(name) && name !== 'modules')

        if(resolveCommands.length === 0) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.error(interaction.member, 'Выключение модулей', `Все **команды** в этой **категории** выключены`, true) ]
            })
        }

        text = `Вы выключили команду **${command.name}** и категорию команд **${commandModule}**`
        doc.disableCommands.push(command.name, ...resolveCommands)
    }

    await client.db.guilds.save(doc)

    return interaction.editReply({
        embeds: [ client.storage.embeds.success(interaction.member, 'Выключение модулей', text, true) ]
    })*/
}