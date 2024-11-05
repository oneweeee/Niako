import BaseListener from "#base/BaseListener";
import {
    ActivityType,
    Presence,
} from "discord.js";

export default new BaseListener(
    { name: 'presenceUpdate' },
    async (client, oldPresence: Presence, newPresence: Presence) => {
        if(!oldPresence?.member || !newPresence?.member) return

        if(oldPresence.status !== newPresence.status) {
            const auditChannel = await client.db.audits.resolveChannel(newPresence.member.guild, 'PresenceStatus')
            if(auditChannel) {
                const embed = client.storage.embeds.color(client.db.guilds.getColor(newPresence.member.guild.id))
                .setAuthor(
                    {
                        name: 'Обновление статуса',
                        iconURL: client.icons['Member']['Yellow']
                    }
                )
                .setImage(client.icons['Guild']['Line'])
                .setThumbnail(client.util.getAvatar(newPresence.member))

                .addFields(
                    {
                        name: '> Пользователь:',
                        value: `・${newPresence.member.toString()} \n・${newPresence.member.user.tag} \n・${newPresence.member.id}`
                    },
                    {
                        name: '> Старое значение:',
                        inline: true,
                        value: client.util.toCode(`${oldPresence.status}`)
                    },
                    {
                        name: '> Новое значение:',
                        inline: true,
                        value: client.util.toCode(`${newPresence.status}`)
                    }
                )
    
                await auditChannel.text.send({ embeds: [ embed ]}).catch(() => {})
            }
        }

        const doc = await client.db.guilds.get(oldPresence.guild!.id, oldPresence.guild!.preferredLocale)
        if(!doc.gameEnabled) return
        
        if(newPresence.activities.length > 0) {
            const activities = newPresence.activities.filter(
                (a) => !['Сервер', 'Server', 'Discord'].some((str) => a.name.includes(str)) && a.type === ActivityType.Playing
            )

            for ( let i = 0; activities.length > i; i++ ) {
                const a = activities[i]
                let cfg: { id: string; name: string; enabled: boolean; } | undefined = doc.gameRoles.find((r) => r.name === a.name)
                let findRole = newPresence.guild!.roles.cache.get(cfg?.id || '0')
                if(!cfg || !findRole) {
                    findRole = await newPresence.guild!.roles.create(
                        { 
                            name: a.name,
                            position: (newPresence.guild!.roles.cache.get(doc.gameRolePosition)?.position || 0)
                        }
                    ).catch(() => undefined)
                    
                    if(!findRole) return

                    if(!cfg) {
                        cfg = { name: a.name, enabled: true, id: findRole.id }
                        doc.gameRoles.push(cfg)    
                        await client.db.guilds.save(doc)
                    }
                }

                if(!findRole) return

                return newPresence.member.roles.add(findRole.id).catch(() => {})
            }
        }
    }
)