import { ApplicationCommandOptionType, InteractionCollector } from "discord.js";
import BaseSlashCommand from "../../../struct/base/BaseSlashCommand";
import ms from "ms";

export default new BaseSlashCommand(
    'history',
    {
        name: 'history',
        description: 'История наказаний',
        options: [
            {
                name: 'member',
                description: 'Пользователь, история которого Вас интересует',
                type: ApplicationCommandOptionType.User
            }
        ]
    },
    async (client, interaction) => {
        await interaction.deferReply({ fetchReply: true })
        
        const member = interaction.options.getMember('member') ?? interaction.member

        let history = await client.db.history.find(interaction.guildId, member.id)

        const message = await interaction.editReply({
            embeds: [ client.storage.embeds.history(member, history) ],
            components: client.storage.components.history(history, 0, client.util.isModerator(interaction.member))
        })

        const collector = new InteractionCollector(client, { time: 60_000, message })

        collector.on('collect', async (int): Promise<any> => {
            if(int.user.id !== interaction.member.id) {
                return int.deferUpdate().catch(() => {})
            }

            collector.resetTimer()

            if(int.isButton()) {
                const footer = int.message!.embeds[0]?.footer?.text

                switch(int.customId) {
                    case 'trash':
                        return collector.stop('time')
                    case 'refuse.delete':
                    case 'leave':
                        history = await client.db.history.find(interaction.guildId, member.id)
                        await interaction.editReply({
                            embeds: [ client.storage.embeds.history(member, history) ],
                            components: client.storage.components.history(history, 0, client.util.isModerator(interaction.member))
                        })
                        break
                    case 'forward':
                        const pageForward = Number(footer!.split('/')[0].split(': ')[1])
                        await interaction.editReply({
                            embeds: [ client.storage.embeds.history(member, history, pageForward) ],
                            components: client.storage.components.history(history, pageForward, client.util.isModerator(interaction.member))
                        })
                        break
                    case 'back':
                        const pageBack = Number(footer!.split('/')[0].split(': ')[1])-2
                        await interaction.editReply({
                            embeds: [ client.storage.embeds.history(member, history, pageBack) ],
                            components: client.storage.components.history(history, pageBack, client.util.isModerator(interaction.member))
                        })
                        break
                    default:
                        console.log(int.customId)
                        switch(int.customId.split('.')[0]) {
                            case 'delete':
                                const find = history.find((h) => String(h.createdTimestamp) === int.customId.split('.')[1])
                                if(!find) {
                                    await interaction.editReply({
                                        embeds: [ client.storage.embeds.default(interaction.member, 'Удаление нарушения', `Я **не** смог найти нарушение`, { target: member }) ],
                                        components: client.storage.components.leave()
                                    })
                                } else {
                                    await interaction.editReply({
                                        embeds: [ client.storage.embeds.default(interaction.member, 'Удаление нарушения', `Вы действительно хотите удалить нарушение **${find.reason}** пользователю ${member.toString()}`, { target: member }) ],
                                        components: client.storage.components.choose(`.${find.createdTimestamp}`, 'refuse.delete')
                                    })
                                }
                                break
                            case 'agree':
                                const getHistory = history.find((h) => String(h.createdTimestamp) === int.customId.split('.')[1])
                                if(!getHistory) {
                                    await interaction.editReply({
                                        embeds: [ client.storage.embeds.default(interaction.member, 'Удаление нарушения', `Я **не** смог найти нарушение`, { target: member }) ],
                                        components: client.storage.components.leave()
                                    })
                                } else {
                                    const reason = getHistory.reason

                                    await getHistory.remove()

                                    await interaction.editReply({
                                        embeds: [ client.storage.embeds.default(interaction.member, 'Удаление нарушения', `Вы успешно удалили нарушение **${reason}** пользователю ${member.toString()}`, { target: member }) ],
                                        components: client.storage.components.leave()
                                    })
                                }
                                break
                        }
                }
            }

            if(!int.deferred && !int.replied) return int.deferUpdate().catch(() => {})
        })

        collector.on('end', (coll: any, reason: string) => {
            if(reason === 'time') {
                return interaction.deleteReply()
            }
        })
    }
)