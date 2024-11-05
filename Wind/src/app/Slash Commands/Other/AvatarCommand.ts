import { ApplicationCommandOptionType } from "discord.js"
import BaseSlashCommand from "#base/BaseSlashCommand"

export default new BaseSlashCommand(
    {
        name: 'avatar',
        description: 'Посмотреть аватар или баннер пользователя',
        descriptionLocalizations: {
            'ru': 'Посмотреть аватар или баннер пользователя',
            'en-US': 'View user avatar or banner'
        },
        category: 'info',
        options: [
            {
                name: 'пользователь',
                nameLocalizations: {
                    'ru': 'пользователь',   
                    'en-US': 'user'
                },
                description: 'Пользователь',
                descriptionLocalizations: {
                    'ru': 'Пользователь',
                    'en-US': 'User'
                },
                type: ApplicationCommandOptionType.User
            }
        ]
    },

    async (client, interaction, { locale }) => {
        await interaction.deferReply()

        const member = interaction.options.getMember('пользователь') ?? interaction.member

        const message = await interaction.editReply({
            embeds: [
                client.storage.embeds.color(client.db.guilds.getColor(interaction.guildId))
                .setTitle(`${client.services.lang.get("commands.avatar.profile", locale)} — ${member.user.username}`)
                .setDescription(`[PNG](${client.util.getAvatar(member.user)}) | [JPG](${client.util.getAvatar(member.user, 4096, 'jpg')}) ${member.user?.avatar && member.user.avatar.startsWith('a_') ? `| [GIF](${client.util.getAvatar(member.user, 4096, 'gif')})` : ''}`)
                .setImage(client.util.getAvatar(member.user))
                .setThumbnail(client.util.getAvatar(member.user))
            ],
            components: client.storage.components.avatar('profile', locale)
        })

        return client.storage.collectors.interaction(
            interaction, message, async (int) => {
                if(!int.isStringSelectMenu()) return

                const embed = client.storage.embeds.color(client.db.guilds.getColor(interaction.guildId))

                switch(int.values[0]) {
                    case 'profile':
                        embed
                        .setTitle(`${client.services.lang.get("commands.avatar.profile", locale)} — ${member.user.username}`)
                        .setDescription(`[PNG](${client.util.getAvatar(member.user)}) | [JPG](${client.util.getAvatar(member.user, 4096, 'jpg')}) ${member.user?.avatar && member.user.avatar.startsWith('a_') ? `| [GIF](${client.util.getAvatar(member.user, 4096, 'gif')})` : ''}`)
                        .setImage(client.util.getAvatar(member.user))
                        .setThumbnail(client.util.getAvatar(member.user))
                        break

                    case 'guild':
                        embed
                        .setTitle(`${client.services.lang.get("commands.avatar.server", locale)} — ${member.user.username}`)
                        .setDescription(`[PNG](${client.util.getAvatar(member)}) | [JPG](${client.util.getAvatar(member, 4096, 'jpg')}) ${member?.avatar && member.avatar.startsWith('a_') ? `| [GIF](${client.util.getAvatar(member, 4096, 'gif')})` : ''}`)
                        .setImage(client.util.getAvatar(member))
                        .setThumbnail(client.util.getAvatar(member.user))
                        break

                    case 'banner':
                        const user = await member.user.fetch()
                        embed
                        .setTitle(`${client.services.lang.get("commands.avatar.banner", locale)} — ${member.user.username}`)
                        .setDescription(user?.banner ? `[PNG](${client.util.getBanner(user)}) | [JPG](${client.util.getBanner(user, 4096, 'jpg')}) ${user.banner.startsWith('a_') ? `| [GIF](${client.util.getBanner(user, 4096, 'gif')})` : ''}` : `${interaction.member.toString()}, ${client.services.lang.get("commands.avatar.on", locale)} ${member.toString()} ${client.services.lang.get("commands.avatar.no", locale)}`)
                        .setImage(client.util.getBanner(user))
                        break
                }

                return interaction.editReply({
                    embeds: [ embed ], components: client.storage.components.avatar(int.values[0], locale)
                })
            }
        )
    }
)