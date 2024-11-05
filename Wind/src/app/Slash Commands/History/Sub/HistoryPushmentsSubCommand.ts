import { CommandInteraction, Locale } from "discord.js";
import WindClient from "#client";

export default async (client: WindClient, interaction: CommandInteraction<'cached'>, locale: Locale) => {
    const target = interaction.options.getMember('user') ?? interaction.member
    const pushments = (await client.db.guildMembers.get(target)).actions

    const message = await interaction.editReply({
        embeds: [ client.storage.embeds.pushments(interaction, client.db.guilds.getColor(interaction.guildId), target, pushments, locale) ],
        components: client.storage.components.paginator(pushments, { page: 0, count: 8, extra: true, trash: true })
    })

    return client.storage.collectors.interaction(
        interaction, message, async (int) => {
            if(!int.isButton()) return

            switch(int.customId) {
                case 'trash':
                    return interaction.deleteReply()
                case 'backward':
                    return interaction.editReply({
                        embeds: [ client.storage.embeds.pushments(interaction, client.db.guilds.getColor(interaction.guildId), target, pushments, locale) ],
                        components: client.storage.components.paginator(pushments, { page: 0, count: 8, extra: true, trash: true })
                    })
                case 'left':
                    const left = Number(int.message.embeds[0].footer!.text.split(' ')[1].split('/')[0])-2
                    return interaction.editReply({
                        embeds: [ client.storage.embeds.pushments(interaction, client.db.guilds.getColor(interaction.guildId), target, pushments, locale, left) ],
                        components: client.storage.components.paginator(pushments, { page: left, count: 8, extra: true, trash: true })
                    })
                case 'right':
                    const right = Number(int.message.embeds[0].footer!.text.split(' ')[1].split('/')[0])
                    return interaction.editReply({
                        embeds: [ client.storage.embeds.pushments(interaction, client.db.guilds.getColor(interaction.guildId), target, pushments, locale, right) ],
                        components: client.storage.components.paginator(pushments, { page: right, count: 8, extra: true, trash: true })
                    })
                case 'forward':
                    const page = Number(int.message.embeds[0].footer!.text.split(': ')[1].split('/')[1])-1
                    return interaction.editReply({
                        embeds: [ client.storage.embeds.pushments(interaction, client.db.guilds.getColor(interaction.guildId), target, pushments, locale, page) ],
                        components: client.storage.components.paginator(pushments, { page, count: 8, extra: true, trash: true })
                    })
            }
        }
    )
}