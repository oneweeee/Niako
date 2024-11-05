import { ApplicationCommandOptionType } from "discord.js";
import BaseSlashCommand from "#base/BaseSlashCommand";

export default new BaseSlashCommand(
    {
        name: 'unlockdown',
        description: 'Unlockdown',
        descriptionLocalizations: {
            'ru': 'Убрать карантин'
        },
        category: 'mod',
        options: [
            {
                name: 'user',
                nameLocalizations: {
                    'ru': 'пользователь'
                },
                description: 'User',
                descriptionLocalizations: {
                    'ru': 'Пользователь'
                },
                type: ApplicationCommandOptionType.User,
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

        const target = interaction.options.getMember('user')!
        if(!target) {
            return interaction.reply({ content: `${client.services.lang.get("пользователь не найден", locale)}`, ephemeral: true })
        }
        
        if(target.user.bot) {
            return interaction.reply({ content: `${client.services.lang.get("на ботах юзать нельзя", locale)}`, ephemeral: true })
        }

        if(target.id === interaction.member.id) {
            return interaction.reply({ content: `${client.services.lang.get("на себе юзать нельзя", locale)}`, ephemeral: true })
        }

        if(!target.roles.cache.has(res.banId)) {
            return interaction.reply({ content: `${client.services.lang.get("без карантина", locale)}`, ephemeral: true })
        }

        const doc = await client.db.guildMembers.get(target)
        await target.roles.remove(res.banId)
        .then(async () => {
            await interaction.deferReply()
            
            const get = doc.actions.find((p) => p.active && p.type === 'Lockdown')
            if(get) {
                get.active = false
            }
            doc.markModified('actions')
            await client.db.guildMembers.save(doc)
            await client.db.audits.sendCustomModLogger('GuildBanRemove', interaction.member, target, {}, interaction.guildLocale)
                
            return interaction.editReply({
                embeds: [
                    client.storage.embeds.default(
                        interaction.member, client.db.guilds.getColor(interaction.guildId), `Карантин участника`,
                        locale, `Вы **успешно** сняли **карантин** с ${target.toString()}`,
                        { indicateTitle: true, target }
                    )
                ]
            })
        }).catch(() => {
            return interaction.reply({
                embeds: [
                    client.storage.embeds.default(
                        interaction.member, client.db.guilds.getColor(interaction.guildId), `Карантин участника`,
                        locale, `Произошла ошибка! Я **не** смог **снять** карантин с ${target.toString()}`,
                        { indicateTitle: true, target }
                    )
                ], ephemeral: true
            })
        })
    }
)