import { NiakoClient } from "../../../../struct/client/NiakoClient";
import { CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, lang: string) => {
    /*const doc = await client.db.guilds.get(interaction.guildId)

    const commandName = interaction.options.get('command')?.value as string
    const commandModule = interaction.options.get('category')?.value as string
    let text = ''

    if(!commandModule && !commandName) {
        return interaction.editReply({
            embeds: [ client.storage.embeds.error(interaction.member, 'Включение модулей', `Вы **не** указали ни один **параметр**`, true) ]
        })
    } else if(commandModule && !commandName) {
        const commands = client.storage.slashCommands.cache.filter((c) => c.options.module === commandModule)
        if(commands.size === 0) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.error(interaction.member, 'Включение модулей', `Я **не** нашла команды с **такой** категорией`, true) ]
            })
        }

        const resolveCommands = commands.map((c) => c.name).filter((name) => doc.disableCommands.includes(name) && name !== interaction.commandName)

        if(resolveCommands.length === 0) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.error(interaction.member, 'Включение модулей', `Все **команды** в этой **категории** включены`, true) ]
            })
        }

        text = `Вы включили модуль **${commandModule}**`
        for ( let i = 0; resolveCommands.length > i; i++ ) {
            doc.disableCommands.splice(doc.disableCommands.indexOf(resolveCommands[0]), 1)
        }
    } else if(commandName && !commandModule) {
        const command = client.storage.slashCommands.cache.get(commandName)
        if(!command) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.error(interaction.member, 'Включение модулей', `Я **не** нашла команду с **таким** названием`, true) ]
            })
        }

        if(command.name === interaction.commandName) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.error(interaction.member, 'Включение модулей', `Вы **не** можете **взаимодействовать** с командой **${interaction.commandName}**`, true) ]
            })
        }

        if(!doc.disableCommands.includes(command.name)) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.error(interaction.member, 'Включение модулей', `Команда ${command.name} и так включена`, true) ]
            })
        }

        text = `Вы выключили команду **${command.name}**`
        doc.disableCommands.splice(doc.disableCommands.indexOf(commandName), 1)
    } else {
        const command = client.storage.slashCommands.cache.get(commandName)
        if(!command) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.error(interaction.member, 'Включение модулей', `Я **не** нашла команду с **таким** названием`, true) ]
            })
        }

        if(command.name === interaction.commandName) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.error(interaction.member, 'Включение модулей', `Вы **не** можете **взаимодействовать** с командой **${interaction.commandName}**`, true) ]
            })
        }

        if(!doc.disableCommands.includes(command.name)) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.error(interaction.member, 'Включение модулей', `Команда ${command.name} уже включена`, true) ]
            })
        }

        const commands = client.storage.slashCommands.cache.filter((c) => c.options.module === commandModule)
        if(commands.size === 0) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.error(interaction.member, 'Включение модулей', `Я **не** нашла команды с **такой** категорией`, true) ]
            })
        }

        const resolveCommands = commands.map((c) => c.name).filter((name) => doc.disableCommands.includes(name) && name !== interaction.commandName)

        if(resolveCommands.length === 0) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.error(interaction.member, 'Включение модулей', `Все **команды** в этой **категории** включены`, true) ]
            })
        }

        text = `Вы включили команду **${command.name}** и категорию команд **${commandModule}**`
        doc.disableCommands.splice(doc.disableCommands.indexOf(commandName), 1)
        for ( let i = 0; resolveCommands.length > i; i++ ) {
            doc.disableCommands.splice(doc.disableCommands.indexOf(resolveCommands[0]), 1)
        }
    }

    await client.db.guilds.save(doc)

    return interaction.editReply({
        embeds: [ client.storage.embeds.success(interaction.member, 'Включение модулей', text, true) ]
    })*/
}