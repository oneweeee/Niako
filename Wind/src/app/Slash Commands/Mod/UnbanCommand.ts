import { ApplicationCommandOptionType } from "discord.js";
import BaseSlashCommand from "#base/BaseSlashCommand";

export default new BaseSlashCommand(
    {
        name: 'unban',
        description: 'Unban',
        descriptionLocalizations: {
            'ru': 'Разбан'
        },
        category: 'mod',
        options: [
            {
                name: 'user',
                nameLocalizations: {
                    'ru': 'пользователь'
                },
                description: 'User ID',
                descriptionLocalizations: {
                    'ru': 'ID пользователяы'
                },
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    async (client, interaction, { locale }) => {
        const res = await client.db.guilds.get(interaction.guildId, locale)
        if(
            interaction.guild.ownerId !== interaction.user.id &&
            !interaction.member.permissions.has('Administrator') &&
            !client.config.developers.includes(interaction.user.id) &&
            !client.util.hasRole(interaction.member, res.accessActionRoles)
        ) {
            return interaction.reply({ content: `${client.services.lang.get("commands.info.no_rights", locale)}`, ephemeral: true })
        }

        const targetId = interaction.options.get('user', true)?.value as string

        const ban = interaction.guild.bans.cache.get(targetId)
        if(!ban) {
            return interaction.reply({ content: `${client.services.lang.get("нету в банах", locale)}`, ephemeral: true })
        }

        const doc = await client.db.guildMembers.find(interaction.guildId, targetId)
        await interaction.guild.bans.remove(targetId)
        .then(async () => {
            await interaction.deferReply()
            
            const get = doc.actions.find((p) => p.active && p.type === 'Ban')
            if(get) {
                get.active = false
            }
            doc.markModified('actions')
            await client.db.guildMembers.save(doc)
            await client.db.audits.sendCustomModLogger('GuildBanRemove', interaction.member, ban.user, {}, interaction.guildLocale)
                
            return interaction.editReply({
                embeds: [
                    client.storage.embeds.default(
                        interaction.member, client.db.guilds.getColor(interaction.guildId), `Разбан участника`,
                        locale, `Вы **успешно** разбанили <@!${targetId}>`
                    )
                ]
            })
        }).catch(() => {
            return interaction.reply({
                embeds: [
                    client.storage.embeds.default(
                        interaction.member, client.db.guilds.getColor(interaction.guildId), `Разбан участника`,
                        locale, `Произошла ошибка! Я **не** смог забанить <@!${targetId}>`
                    )
                ], ephemeral: true
            })
        })    
    }
)