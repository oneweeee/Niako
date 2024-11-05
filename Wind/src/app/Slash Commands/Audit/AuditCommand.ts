import BaseSlashCommand from "#base/BaseSlashCommand";
import { IAuditType } from "#db/audit/AuditSchema";
import { TextChannel } from "discord.js";

export default new BaseSlashCommand(
    {
        name: 'audit',
        description: 'Configure server audit',
        descriptionLocalizations: {
            'ru': 'Настроить аудит сервера'
        },
        category: 'settings'
    },
    async (client, interaction, { locale }) => {
        if(
            interaction.guild.ownerId !== interaction.user.id &&
            !interaction.member.permissions.has('Administrator') &&
            !client.config.developers.includes(interaction.user.id)
        ) {
            return interaction.reply({ content: `${client.services.lang.get("commands.audit.no_rights", locale)}`, ephemeral: true })
        }

        await interaction.deferReply()

        const doc = await client.db.audits.get(interaction.guildId)

        const message = await interaction.editReply({
            embeds: [ client.storage.embeds.manageAudit(interaction.member, client.db.guilds.getColor(interaction.guildId), doc, locale) ],
            components: client.storage.components.manageAudit(doc.enabled, locale)
        })

        return client.storage.collectors.interaction(
            interaction, message as any, async (int) => {
                if(int.isButton()) {
                    switch(int.customId) {
                        case 'trash':
                            return interaction.deleteReply()
                        case 'left':
                            const left = Number(int.message.embeds[0].footer!.text.split(' ')[1].split('/')[0])-2
                            const leftDoc = await client.db.audits.get(interaction.guildId)
                            return interaction.editReply({
                                embeds: [ client.storage.embeds.manageAudit(interaction.member, client.db.guilds.getColor(interaction.guildId), leftDoc, locale, left) ],
                                components: client.storage.components.manageAudit(leftDoc.enabled, locale, left)
                            })
                        case 'right':
                            const right = Number(int.message.embeds[0].footer!.text.split(' ')[1].split('/')[0])
                            const rightDoc = await client.db.audits.get(interaction.guildId)
                            return interaction.editReply({
                                embeds: [ client.storage.embeds.manageAudit(interaction.member, client.db.guilds.getColor(interaction.guildId), rightDoc, locale, right) ],
                                components: client.storage.components.manageAudit(rightDoc.enabled, locale, right)
                            })
                        case 'leave':
                            const lvDoc = await client.db.audits.get(interaction.guildId)
                            return interaction.editReply({
                                embeds: [ client.storage.embeds.manageAudit(interaction.member, client.db.guilds.getColor(interaction.guildId), lvDoc, locale) ],
                                components: client.storage.components.manageAudit(lvDoc.enabled, locale)
                            })
                        case 'state':
                            await interaction.editReply({ embeds: [ client.storage.embeds.loading(locale, client.db.guilds.getColor(interaction.guildId)) ], components: [] })

                            const newDoc = await client.db.audits.get(interaction.guildId)
                            newDoc.enabled = !newDoc.enabled
                            await client.db.audits.save(newDoc)

                            return interaction.editReply({
                                embeds: [ client.storage.embeds.manageAudit(interaction.member, client.db.guilds.getColor(interaction.guildId), newDoc, locale) ],
                                components: client.storage.components.manageAudit(newDoc.enabled, locale)
                            })
                        default:
                            const type = int.customId.split('.')[1] as IAuditType
    
                            const res = await client.db.audits.get(interaction.guildId)
                            const i = res.types.findIndex((t) => t.type === type)
                            let config
                            if(i >= 0) {
                                res.types[i].enabled = !res.types[i].enabled
                                config = res.types[i]
                            } else {
                                config = {
                                    type, enabled: false, channelId: ''
                                }
                                res.types.push(config)
                            }
    
                            res.markModified('types')
                            await client.db.audits.save(res)
    
                            return interaction.editReply({
                                embeds: [
                                    client.storage.embeds.default(
                                        interaction.member, client.db.guilds.getColor(interaction.guildId), `Настройка типа — ${type}`, locale, `в этой панели, Вы **можете** настроить тип`
                                    )
                                ],
                                components: client.storage.components.manageAuditType(config, locale)
                            })    
                    }
                } else if(int.isStringSelectMenu()) {
                    const type = int.values[0] as IAuditType
                    const res = await client.db.audits.get(interaction.guildId)

                    const i = res.types.findIndex((t) => t.type === type)
                    let config
                    if(i >= 0) {
                        config = res.types[i]
                    } else {
                        config = {
                            type, enabled: false, channelId: ''
                        }
                        res.types.push(config)
                        
                        res.markModified('types')
                        await client.db.audits.save(res)        
                    }

                    return interaction.editReply({
                        embeds: [
                            client.storage.embeds.default(
                                interaction.member, client.db.guilds.getColor(interaction.guildId), `Настройка типа — ${type}`, locale, `в этой панели, Вы **можете** настроить тип`
                            )
                        ],
                        components: client.storage.components.manageAuditType(config, locale)
                    })
                } else if(int.isChannelSelectMenu()) {
                    if(int.customId.startsWith('chooseEditChannel')) {
                        const channel = int.channels.first() as TextChannel
                        const type = int.customId.split('.')[1] as IAuditType

                        const res = await client.db.audits.get(interaction.guildId)
                        const i = res.types.findIndex((t) => t.type === type)
                        let config
                        if(i >= 0) {
                            res.types[i].channelId = channel.id
                            config = res.types[i]
                        } else {
                            config = {
                                type, enabled: false, channelId: channel.id
                            }
                            res.types.push(config)
                        }

                        res.markModified('types')
                        await client.db.audits.save(res)

                        return interaction.editReply({
                            embeds: [
                                client.storage.embeds.default(
                                    interaction.member, client.db.guilds.getColor(interaction.guildId), `Настройка типа — ${type}`, locale, `в этой панели, Вы **можете** настроить тип`
                                )
                            ],
                            components: client.storage.components.manageAuditType(config, locale)
                        })
                    }
                }
            },
            60_000,
            async (_, reason: string) => {
                if(reason !== 'time') return
                
                return interaction.editReply({
                    embeds: [
                        client.storage.embeds.default(
                            interaction.member, client.db.guilds.getColor(interaction.guildId), 'Настройка аудита', locale
                        )
                    ], components: []
                }).catch(() => {})
            }
        )
    }
)