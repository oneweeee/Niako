import BaseSlashCommand from "../../../struct/base/BaseSlashCommand";

export default new BaseSlashCommand(
    'queue',
    {
        disabled: true,
        voice: true,
        module: 'music',
        name: 'queue',
        description: 'Посмотреть очередь треков',
        detailedDescription: 'Показывает список треков в очереди с информацией о них',
    },

    async (client, interaction, lang) => {
        const guildLevel = client.db.boosts.getGuildLevelById(interaction.guildId)
        if(guildLevel !== 3 && !client.db.badges.partners.has(interaction.guildId)) {
            return interaction.reply({
                embeds: [ client.storage.embeds.needLevel(3) ],
                ephemeral: true
            })
        }

        await interaction.deferReply({ fetchReply: true })

        const queue = await client.db.queues.get(interaction.guildId)
        
        if(queue.tracks.length === 0) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.music('Очередь сервера пуста') ]
            })
        }

        const message = await interaction.editReply({
            embeds: [ client.storage.embeds.queue(interaction.member, queue, 0, lang) ],
            components: client.storage.components.paginator(queue.tracks, lang, 0, 10, false, false)
        })

        client.storage.collectors.interaction(
            interaction,
            message,
            async (int) => {
                if(int.isButton()) {
                    switch(int.customId) {
                        case 'left':
                            const pageLeft = Number(int.message.embeds[0].footer!.text.split(' ')[1].split('/')[0])-2
                            return interaction.editReply({
                                embeds: [ client.storage.embeds.queue(interaction.member, queue, pageLeft, lang) ],
                                components: client.storage.components.paginator(queue.tracks, lang, pageLeft, 10, false, false)
                            })
                        case 'right':
                            const pageRight = Number(int.message.embeds[0].footer!.text.split(' ')[1].split('/')[0])
                            return interaction.editReply({
                                embeds: [ client.storage.embeds.queue(interaction.member, queue, pageRight, lang) ],
                                components: client.storage.components.paginator(queue.tracks, lang, pageRight, 10, false, false)
                            })
                    }
                }
            }
        )
    }
)