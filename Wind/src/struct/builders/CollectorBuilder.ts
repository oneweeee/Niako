import {
    ActionRowBuilder,
    MessageActionRowComponentBuilder,
    ButtonBuilder,
    ChannelSelectMenuBuilder,
    CollectedInteraction,
    CommandInteraction,
    ComponentType,
    InteractionCollector,
    Message,
    RoleSelectMenuBuilder,
    StringSelectMenuBuilder,
    UserSelectMenuBuilder,
    ButtonInteraction
} from "discord.js"

type TInteractionCollectorRunEnd = (collected: any, reason: string) => Promise<any>

type TInteractionCollectorRun = (int: CollectedInteraction<'cached'>) => Promise<any>

export default class CollectorBuilder {
    interaction(
        interaction: CommandInteraction<'cached'> | ButtonInteraction<'cached'> | Message<true>, message: Message, run: TInteractionCollectorRun, time: number = 60_000, endRun?: TInteractionCollectorRunEnd, max?: number
    ) {
        const collector = new InteractionCollector(
            interaction.client,
            { message, time, max }
        )

        collector.on('collect', async (int: CollectedInteraction<'cached'>): Promise<any> => {
            collector.resetTimer()

            if(int.user.id !== interaction.member!.id) {
                return int.deferUpdate()
            }

            await run(int).catch((err) => console.log(err))

            if(!int.replied && !int.deferred) {
                return int.deferUpdate().catch(() => {})
            }
        })

        collector.on('end', async (collected: any, reason: string) => {
            if(!endRun && reason === 'time') {
                if(interaction instanceof Message) {
                    return interaction.delete().catch(() => {})
                } else {
                    return interaction.editReply({ components: this.disableComponents( await interaction.fetchReply() )})
                }
            } else if(endRun) {
                return endRun(collected, reason)
            }
        })

        return collector
    }

    message(authorId: string, message: Message<true>, run: TInteractionCollectorRun, time: number = 60_000, endRun?: TInteractionCollectorRunEnd, max?: number
    ) {
        const collector = new InteractionCollector(
            message.client,
            { message, time, max }
        )

        collector.on('collect', async (int: CollectedInteraction<'cached'>): Promise<any> => {
            collector.resetTimer()

            if(int.user.id !== authorId) {
                return int.deferUpdate()
            }

            await run(int).catch(() => {})

            if(!int.replied && !int.deferred) {
                return int.deferUpdate().catch(() => {})
            }
        })

        collector.on('end', async (collected: any, reason: string) => {
            if(!endRun && reason === 'time') {
                return message.edit({ components: this.disableComponents( await message.fetch() )})
            } else if(endRun) {
                return endRun(collected, reason)
            }
        })

        return collector
    }

    private disableComponents(message: Message) {
        const newRows = []
        const rows = message.components

        for ( let i = 0; rows.length > i; i++ ) {
            const components = rows[i].components

            newRows.push(new ActionRowBuilder<MessageActionRowComponentBuilder>())
            
            for ( let j = 0; components.length > j; j++ ) {
                switch(rows[i].components[j].type) {
                    case ComponentType.Button:
                        newRows[i].addComponents(new ButtonBuilder({ ...rows[i].components[j].data, type: ComponentType.Button }).setDisabled(true))
                        break
                    case ComponentType.ChannelSelect:
                        newRows[i].addComponents(new ChannelSelectMenuBuilder({ ...rows[i].components[j].data, type: ComponentType.ChannelSelect }).setDisabled(true))
                        break
                    case ComponentType.RoleSelect:
                        newRows[i].addComponents(new RoleSelectMenuBuilder({ ...rows[i].components[j].data, type: ComponentType.RoleSelect }).setDisabled(true))
                        break
                    case ComponentType.StringSelect:
                        newRows[i].addComponents(new StringSelectMenuBuilder({ ...rows[i].components[j].data, type: ComponentType.StringSelect }).setDisabled(true))
                        break
                    case ComponentType.UserSelect:
                        newRows[i].addComponents(new UserSelectMenuBuilder({ ...rows[i].components[j].data, type: ComponentType.UserSelect }).setDisabled(true))
                        break
                }
            }
        }
        return newRows
    }
}