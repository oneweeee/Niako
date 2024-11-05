import { ApplicationCommandOptionType } from "discord.js"
import BaseSlashCommand from "#base/BaseSlashCommand"

export default new BaseSlashCommand(
    {
        name: 'emoji',
        description: 'Эмодзи',
        descriptionLocalizations: {
            'ru': 'Эмодзи',
            'en-US': 'Emoji'
        },
        category: 'info',
        options: [
            {
                name: 'эмодзи',
                nameLocalizations: {
                    'ru': 'эмодзи',
                    'en-US': 'emoji'
                },
                description: 'Эмодзи',
                descriptionLocalizations: {
                    'ru': 'Эмодзи',
                    'en-US': 'Emoji'
                },
                type: ApplicationCommandOptionType.String
            }
        ]
    },

    async (client, interaction, { locale }) => {
        await interaction.deferReply()

        const optionEmoji = interaction.options.get('эмодзи')?.value as string

        if(optionEmoji) {
            const emoji = (client.emojis.cache.find(
                (e) => `<${e.animated?'a':''}:${e.name}:${e.id}>` === optionEmoji || e.id === optionEmoji
            ) || client.emojis.resolve(optionEmoji))

            if(!emoji && (!optionEmoji.startsWith('<') && !optionEmoji.endsWith('>') && !optionEmoji.includes(':'))) {
                return interaction.editReply({
                    embeds: [
                        client.storage.embeds.default(
                            interaction.member, client.db.guilds.getColor(interaction.guildId), 'Информация об эмодзи',
                            locale, 'Некоректно указано **эмодзи** или его **нет** общих серверах'
                        )
                    ]
                })
            }

            const id = optionEmoji.split(':')[2].replace('>', '')
            const name = optionEmoji.split(':')[1]
            const anime = optionEmoji.split(':')[0].replace('<', '')
            const url = emoji?.url || (`https://cdn.discordapp.com/emojis/${id}.${anime === 'a'?'gif':'png'}?size=4096`)

            return interaction.editReply({
                embeds: [
                    client.storage.embeds.color(client.db.guilds.getColor(interaction.guildId)).setTitle(emoji?.name || name || 'Unknown').setImage(url)
                    .setFooter({ text: `ID: ${id}` }).setTimestamp(emoji?.createdTimestamp || Date.now())
                ],
                components: client.storage.components.rowButtonLink(url, 'Скачать')
            })
        } else {
            const emojis = interaction.guild.emojis.cache.map((e) => e)
            const message = await interaction.editReply({
                embeds: [ client.storage.embeds.emojis(interaction, client.db.guilds.getColor(interaction.guildId), emojis) ],
                components: client.storage.components.paginator(emojis, { page: 0, count: 15, extra: true, trash: true })
            })

            return client.storage.collectors.interaction(
                interaction, message, async (int) => {
                    if(!int.isButton()) return

                    switch(int.customId) {
                        case 'trash':
                            return interaction.deleteReply()
                        case 'backward':
                            return interaction.editReply({
                                embeds: [ client.storage.embeds.emojis(interaction, client.db.guilds.getColor(interaction.guildId), emojis) ],
                                components: client.storage.components.paginator(emojis, { page: 0, count: 15, extra: true, trash: true })
                            })
                        case 'left':
                            const left = Number(int.message.embeds[0].footer!.text.split(' ')[1].split('/')[0])-2
                            return interaction.editReply({
                                embeds: [ client.storage.embeds.emojis(interaction, client.db.guilds.getColor(interaction.guildId), emojis, left) ],
                                components: client.storage.components.paginator(emojis, { page: left, count: 15, extra: true, trash: true })
                            })
                        case 'right':
                            const right = Number(int.message.embeds[0].footer!.text.split(' ')[1].split('/')[0])
                            return interaction.editReply({
                                embeds: [ client.storage.embeds.emojis(interaction, client.db.guilds.getColor(interaction.guildId), emojis, right) ],
                                components: client.storage.components.paginator(emojis, { page: right, count: 15, extra: true, trash: true })
                            })
                        case 'forward':
                            const page = Number(int.message.embeds[0].footer!.text.split(': ')[1].split('/')[1])-1
                            return interaction.editReply({
                                embeds: [ client.storage.embeds.emojis(interaction, client.db.guilds.getColor(interaction.guildId), emojis, page) ],
                                components: client.storage.components.paginator(emojis, { page, count: 15, extra: true, trash: true })
                            })
                    }
                }
            )
        }
    }
)