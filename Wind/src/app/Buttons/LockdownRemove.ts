import { ButtonInteraction, Locale } from "discord.js";
import BaseInteraction from "#base/BaseInteraction";
import WindClient from "#client";

export default new BaseInteraction(
    { name: 'removeLockdown' },
    async (client: WindClient, button: ButtonInteraction<'cached'>, locale: Locale) => {
        const id = button.customId.split('.')[1]
        if(!id) return button.reply({ content: `${button.user.toString()}, ID кнопки не был найден`, ephemeral: true })

        const member = await client.util.getMember(button.guild, id)
        if(!member) return button.reply({ content: `${button.user.toString()}, участник не был найден`, ephemeral: true })

        const crash = await client.db.crashs.get(button.guildId)
        if(
            button.user.id !== button.guild.ownerId &&
            !client.config.developers.includes(button.user.id) &&
            !crash.whiteList.includes(button.user.id)  &&
            button.member.roles.highest.position !== button.guild.roles.cache.size-1
        ) {
            return button.reply({ content: `${button.user.toString()}, возвращать из карантина могут только люди которые есть в белом списке или же владелец сервера`, ephemeral: true })
        }

        await button.message.edit({
            components: []
        })

        await button.deferReply({ ephemeral: true }).catch(() => {})

        if(crash.banId !== '0' && member.roles.cache.has(crash.banId)) {
            await member.roles.remove(crash.banId).catch(() => {})
        }

        const res = await client.db.guildMembers.get(member)

        res.warns = 0
        await client.util.addRoles(member, res.roles)
        res.roles = []
        res.markModified('roles')
        await client.db.guildMembers.save(res)

        await button.editReply({
            content: `${button.user.toString()}, все роли ${member.toString()} были возвращены`
        })

        const copy = client.storage.embeds.from(button.message.embeds[0].data)
        
        .setFooter(
            {
                text: `Снял карантин — ${button.user.username}`,
                iconURL: client.util.getAvatar(button.member) ?? undefined
            }
        )

        return button.message.edit({
            embeds: [ copy ],
            components: [ client.storage.components.removeLockdown(id, button.locale, true) ]
        })
    }
)