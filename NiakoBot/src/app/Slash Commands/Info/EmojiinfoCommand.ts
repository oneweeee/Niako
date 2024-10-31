import BaseSlashCommand from "../../../struct/base/BaseSlashCommand";
import { ApplicationCommandOptionType } from "discord.js";

export default new BaseSlashCommand(
    'emojiinfo',
    {
        module: 'info',
        name: 'emojiinfo',
        description: 'Посмотреть информацию об эмодзи',
        detailedDescription: 'Показывает информацию о эмодзи: название, ссылка, Id',
        usage: '/emojiinfo [<:emoji_name:id>]',

        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: 'emoji',
                nameLocalizations: {
                    'ru': 'эмодзи'
                },

                detailedDescription: '123',
                description: 'emoji',
                descriptionLocalizations: {
                    'ru': 'Укажите эмодзи, о котором хотите узнать информацию'
                },
                required: true
            }
        ]
    },

    async (client, interaction, lang) => {
        await interaction.deferReply()

        const emojiGet = interaction.options.get('emoji', true)?.value as string
        const emoji = interaction.guild.emojis.cache.find((e) => `<${e.animated?'a':''}:${e.name}:${e.id}>` === emojiGet || e.id === emojiGet)
        if(!emoji) {
            return interaction.editReply({
                embeds: [
                    client.storage.embeds.error(
                        interaction.member, 'Информация об эмодзи',
                        'Некоректно указано **эмодзи** или его **нет** на сервере'
                    )
                ]
            })
        }

        return interaction.editReply({
            embeds: [
                client.storage.embeds.color()
                .setTitle(emoji.name)
                .setURL(emoji.url)
                .setImage(emoji.url)
                .setFooter({ text: `Id: ${emoji.id}` })
                .setTimestamp(emoji.createdTimestamp)
            ]
        })
    }
)