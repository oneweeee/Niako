import { ActivityType, ChannelType, StringSelectMenuBuilder } from "discord.js";
import Client from "../../../struct/client/Client";
import BaseEvent from "../../../struct/base/BaseEvent";
import moment from "moment-timezone";

export default new BaseEvent(
    {
        name: 'ready',
        once: true
    },
    async (client: Client) => {        
        client.logger.success(`${client.user.tag} is login`)
        
        await client.storage.slashCommands.initGlobalApplicationCommands()
        
        await client.db.init()

        const guild = client.guilds.cache.get(client.config.meta.guildId)
        if(guild) {
            client.user.setActivity(
                {
                    name: guild.name,
                    type: ActivityType.Watching
                }
            )
            /*const channelMemo = guild.channels.cache.get(client.config.memo.channelId)
            if(channelMemo && channelMemo.type === ChannelType.GuildText) {
                (await channelMemo.messages.fetch()).filter((m) => m.author.id === client.user.id).map(async (m) => await m.delete().catch(() => {}))
                await channelMemo.send({
                    embeds: client.config.memo.embeds,
                    components: [
                        client.storage.components.createStringSelectRow()
                        .addComponents(
                            new StringSelectMenuBuilder()
                            .setCustomId('memo')
                            .setPlaceholder('Хотите что-то узнать?')
                            .setOptions(client.config.memo.options)
                        )
                    ]
                })
            }

            const channelNotice = guild.channels.cache.get(client.config.notice.channelId)
            if(channelNotice && channelNotice.type === ChannelType.GuildText) {
                (await channelNotice.messages.fetch()).filter((m) => m.author.id === client.user.id).map(async (m) => await m.delete().catch(() => {}))
                await channelNotice.send({
                    embeds: client.config.notice.embeds,
                    components: [
                        client.storage.components.createStringSelectRow()
                        .addComponents(
                            new StringSelectMenuBuilder()
                            .setCustomId('notice')
                            .setPlaceholder('Выберете роль для уведомлений...')
                            .setMaxValues(client.config.notice.options.length)
                            .setOptions([
                                { label: 'Очистить выбор', value: 'clear', emoji: client.config.emojis.clear },
                                ...client.config.notice.options
                            ])
                        )
                    ]
                })
            }

            const channelTicket = guild.channels.cache.get(client.config.ticket.channelId)
            if(channelTicket && channelTicket.type === ChannelType.GuildText) {
                (await channelTicket.messages.fetch()).filter((m) => m.author.id === client.user.id).map(async (m) => await m.delete().catch(() => {}))
                await channelTicket.send({
                    embeds: client.config.ticket.embeds,
                    components: [
                        client.storage.components.createStringSelectRow()
                        .addComponents(
                            new StringSelectMenuBuilder()
                            .setCustomId('createTicket')
                            .setPlaceholder('О чем хотите создать тикет?')
                            .setOptions(client.config.ticket.options)
                        )
                    ]
                })
            }

            const channelBlock = guild.channels.cache.get(client.config.block.channelId)
            if(channelBlock && channelBlock.type === ChannelType.GuildText) {
                (await channelBlock.messages.fetch()).filter((m) => m.author.id === client.user.id).map(async (m) => await m.delete().catch(() => {}))
                await channelBlock.send({
                    embeds: client.config.block.embeds,
                    components: client.storage.components.createButtonBlockRow()
                })
            }

            const channelRules = guild.channels.cache.get(client.config.rules.channelId)
            if(channelRules && channelRules.type === ChannelType.GuildText) {
                (await channelRules.messages.fetch()).filter((m) => m.author.id === client.user.id).map(async (m) => await m.delete().catch(() => {}))
                await channelRules.send({
                    embeds: client.config.rules.embeds
                })
            }

            const channelSet = guild.channels.cache.get(client.config.set.channelId)
            if(channelSet && channelSet.type === ChannelType.GuildText) {
                (await channelSet.messages.fetch()).filter((m) => m.author.id === client.user.id).map(async (m) => await m.delete().catch(() => {}))
                await channelSet.send({
                    embeds: client.config.set.embeds,
                    components: [
                        client.storage.components.createStringSelectRow()
                        .addComponents(
                            new StringSelectMenuBuilder()
                            .setCustomId('set')
                            .setPlaceholder('Выберите, на какого хотите подать заявку...')
                            .setOptions(
                                Object.values(client.config.set.sets).filter((s) => guild.roles.cache.has(s.roleId)).map((s) => {
                                    const role = guild.roles.cache.get(s.roleId)!
                                    return { label: role.name, value: role.id, emoji: s.emoji }
                                })
                            )
                        )
                    ]
                })
            }*/

            setInterval(async () => {
                const doc = await client.db.guilds.get(guild.id)
                
                if(Date.now() > doc.help.sendingTimestamp) {
                    doc.help.sendingTimestamp = (Date.now() + 1 * 1000 * 60)

                    const channel = guild.channels.cache.get(client.config.meta.chatId)
                    if(channel && channel.type === ChannelType.GuildText) {
                        const messages = (await channel.messages.fetch({ limit: 100 })).map((m) => m)
                        const index = messages.findIndex((m) => m.author.id === client.user!.id)
                        if(index >= 5 || index === -1) {
                            messages.filter((m) => m.author.id === client.user!.id).map(async (m) => await m.delete().catch(() => {}))
                            await channel.send({ content: `Если вы хотите быть **услышанным** не стоит задавать **вопросы** в этом чате, ведь он **предназначен** исключительно для **общения** и **вопросы** в нем скорее всего будут **проигнорированы**.\n> Если вам **требуется** помощь **воспользуйтесь** созданием тикета в <#${client.config.ticket.channelId}>` })
                        }
                    }

                    doc.markModified('help')
                    await client.db.guilds.save(doc)
                }

                return
            }, 60_000)

            const buffer = await client.canvas.drawDefaultBanner()
            await guild.setBanner(buffer).catch(() => {})

            setInterval(async () => {
                const buffer = await client.canvas.drawDefaultBanner()
                return guild.setBanner(buffer).catch(() => {})
            }, 60_000)

            /*setInterval(async () => {
                const hh = Number(moment(Date.now()).tz(`Europe/Moscow`).locale('ru-RU').format('HH'))
                const parent = guild.channels.cache.get(client.config.ticket.createParentId)

                if(parent && parent.type === ChannelType.GuildCategory) {
                    if((hh >= 18 || 10 > hh) && parent.name !== 'Закрыто до 10 утра') {
                        parent.children.cache.filter((c) => c.name.endsWith('поддержка')).map(async (c) => {
                            await c.permissionOverwrites.edit(guild.id, { 'ViewChannel': false })
                        })

                        return parent.setName('Закрыто до 10 утра')
                    } else if(parent.name !== '─ ▹  Технические') {
                        parent.children.cache.filter((c) => c.name.endsWith('поддержка')).map(async (c) => {
                            await c.permissionOverwrites.edit(guild.id, { 'ViewChannel': true })
                        })

                        return parent.setName('─ ▹  Технические')
                    }
                }

                return
            }, 60_000)*/
        }
    }
)