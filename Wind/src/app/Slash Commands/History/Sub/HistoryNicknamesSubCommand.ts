import { CommandInteraction, Locale } from "discord.js";
import WindClient from "#client";

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, locale: Locale) => {
    const target = interaction.options.getMember('user') ?? interaction.member
    const nicknames = (await client.db.guildMembers.get(target)).nicknames

    const message = await interaction.editReply({
        embeds: [ client.storage.embeds.nicknames(interaction, client.db.guilds.getColor(interaction.guildId), target, nicknames, locale) ],
        components: client.storage.components.paginator(nicknames, { page: 0, count: 5, extra: true, trash: true })
    })

    return client.storage.collectors.interaction(
        interaction, message, async (int) => {
            if(!int.isButton()) return

            switch(int.customId) {
                case 'trash':
                    return interaction.deleteReply()
                case 'backward':
                    return interaction.editReply({
                        embeds: [ client.storage.embeds.nicknames(interaction, client.db.guilds.getColor(interaction.guildId), target, nicknames, locale) ],
                        components: client.storage.components.paginator(nicknames, { page: 0, count: 5, extra: true, trash: true })
                    })
                case 'left':
                    const left = Number(int.message.embeds[0].footer!.text.split(' ')[1].split('/')[0])-2
                    return interaction.editReply({
                        embeds: [ client.storage.embeds.nicknames(interaction, client.db.guilds.getColor(interaction.guildId), target, nicknames, locale, left) ],
                        components: client.storage.components.paginator(nicknames, { page: left, count: 5, extra: true, trash: true })
                    })
                case 'right':
                    const right = Number(int.message.embeds[0].footer!.text.split(' ')[1].split('/')[0])
                    return interaction.editReply({
                        embeds: [ client.storage.embeds.nicknames(interaction, client.db.guilds.getColor(interaction.guildId), target, nicknames, locale, right) ],
                        components: client.storage.components.paginator(nicknames, { page: right, count: 5, extra: true, trash: true })
                    })
                case 'forward':
                    const page = Number(int.message.embeds[0].footer!.text.split(': ')[1].split('/')[1])-1
                    return interaction.editReply({
                        embeds: [ client.storage.embeds.nicknames(interaction, client.db.guilds.getColor(interaction.guildId), target, nicknames, locale, page) ],
                        components: client.storage.components.paginator(nicknames, { page, count: 5, extra: true, trash: true })
                    })
            }
        }
    )
}