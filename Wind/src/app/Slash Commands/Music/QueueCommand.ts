import BaseSlashCommand from "#base/BaseSlashCommand"

export default new BaseSlashCommand(
    {
        name: 'queue',
        description: 'Очередь треков',
        descriptionLocalizations: {
            'ru': 'Очередь треков',
            'en-US': 'Queue tracks'
        },
        category: 'music'
    },

    async (client, interaction, { locale }) => {
        await interaction.deferReply({ ephemeral: true })

        if(!interaction.member.voice?.channelId) {
            return interaction.editReply({ content: 'Нет в войсе' })
        }

        const me = await interaction.guild.members.fetchMe().catch(() => null)
        if(!me || !me.voice?.channelId) {
            return interaction.editReply({ content: 'Меня нет в войсе' })
        }

        const queue = client.player.getQueue(interaction.guildId)
        if(!queue || !queue.tracks.length) {
            return interaction.editReply({ content: 'Пустая очередь' })
        }

        const message = await interaction.editReply({
            embeds: [ client.storage.embeds.queue(interaction, client.db.guilds.getColor(interaction.guildId), queue.tracks, locale) ],
            components: client.storage.components.paginator(queue.tracks, { page: 0, count: 12, extra: true, trash: true })
        })

        return client.storage.collectors.interaction(
            interaction, message, async (int) => {
                if(!int.isButton()) return

                switch(int.customId) {
                    case 'trash':
                        return interaction.deleteReply()
                    case 'backward':
                        return interaction.editReply({
                            embeds: [ client.storage.embeds.queue(interaction, client.db.guilds.getColor(interaction.guildId), queue.tracks, locale) ],
                            components: client.storage.components.paginator(queue.tracks, { page: 0, count: 12, extra: true, trash: true })
                        })
                    case 'left':
                        const left = Number(int.message.embeds[0].footer!.text.split(' ')[1].split('/')[0])-2
                        return interaction.editReply({
                            embeds: [ client.storage.embeds.queue(interaction, client.db.guilds.getColor(interaction.guildId), queue.tracks, locale, left) ],
                            components: client.storage.components.paginator(queue.tracks, { page: left, count: 12, extra: true, trash: true })
                        })
                    case 'right':
                        const right = Number(int.message.embeds[0].footer!.text.split(' ')[1].split('/')[0])
                        return interaction.editReply({
                            embeds: [ client.storage.embeds.queue(interaction, client.db.guilds.getColor(interaction.guildId), queue.tracks, locale, right) ],
                            components: client.storage.components.paginator(queue.tracks, { page: right, count: 12, extra: true, trash: true })
                        })
                    case 'forward':
                        const page = Number(int.message.embeds[0].footer!.text.split(': ')[1].split('/')[1])-1
                        return interaction.editReply({
                            embeds: [ client.storage.embeds.queue(interaction, client.db.guilds.getColor(interaction.guildId), queue.tracks, locale, page) ],
                            components: client.storage.components.paginator(queue.tracks, { page, count: 12, extra: true, trash: true })
                        })
                }
            }
        )
    }
)