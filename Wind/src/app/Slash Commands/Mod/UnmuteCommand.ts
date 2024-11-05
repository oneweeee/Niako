import { ApplicationCommandOptionType } from "discord.js";
import BaseSlashCommand from "#base/BaseSlashCommand";
import ms from "ms";

export default new BaseSlashCommand(
    {
        name: 'unmute',
        description: 'Unmute',
        descriptionLocalizations: {
            'ru': 'Разглушить'
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
        const doc = await client.db.guilds.get(interaction.guildId, locale)
        if(
            interaction.guild.ownerId !== interaction.user.id &&
            !interaction.member.permissions.has('Administrator') &&
            !client.config.developers.includes(interaction.user.id) &&
            !client.util.hasRole(interaction.member, doc.accessActionRoles)
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

        await interaction.deferReply()
    
        if(doc.mutes.general?.roleId && target.roles.cache.has(doc.mutes.general?.roleId)) {
            await target.roles.remove(doc.mutes.general.roleId).catch(() => {})
        }
        
        if(doc.mutes.text?.roleId && target.roles.cache.has(doc.mutes.text?.roleId)) {
            await target.roles.remove(doc.mutes.text.roleId).catch(() => {})
        }
    
        if(doc.mutes.voice?.roleId && target.roles.cache.has(doc.mutes.voice?.roleId)) {
            await target.roles.remove(doc.mutes.voice.roleId).catch(() => {})
        }
    
        if((target?.communicationDisabledUntilTimestamp ?? 0) > Date.now()) {
            await target.disableCommunicationUntil(null).catch(() => {})
        }
    
        const res = await client.db.guildMembers.get(target)
        const get = res.actions.find((p) => p.active && !['Ban', 'Lockdown'].includes(p.type))
        if(get) {
            get.active = false
        }
        res.markModified('actions')
        await client.db.guildMembers.save(res)
        await client.db.audits.sendCustomModLogger('GuildMuteRemove', interaction.member, target, {}, interaction.guildLocale)
    
        return interaction.editReply({
            embeds: [
                client.storage.embeds.default(
                    interaction.member, client.db.guilds.getColor(interaction.guildId), `Размут участника`,
                    locale, `Вы **успешно** разглушили ${target.toString()}`,
                    { indicateTitle: true, target }
                )
            ]
        })
    }
)