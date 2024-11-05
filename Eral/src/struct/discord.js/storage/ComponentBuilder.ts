import { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, UserSelectMenuBuilder } from 'discord.js';
import { IHistory } from '../../../db/history/HistorySchema';
import Client from '../../client/Client';

export default class ComponentBuilder {
    constructor(
        private client: Client
    ) { }

    private buttonSecondary(customId: string) {
        return new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(customId)
    }

    private buttonSuccess(customId: string) {
        return new ButtonBuilder().setStyle(ButtonStyle.Success).setCustomId(customId)
    }

    private buttonPrimary(customId: string) {
        return new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId(customId)
    }

    private buttonDanger(customId: string) {
        return new ButtonBuilder().setStyle(ButtonStyle.Danger).setCustomId(customId)
    }

    private buttonLink(url: string) {
        return new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(url)
    }

    createStringSelectRow() {
        return new ActionRowBuilder<StringSelectMenuBuilder>()
    }

    createButtonBlockRow() {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(this.buttonSecondary('appeal').setLabel('⠀ ⠀ ⠀ ⠀ ⠀ ⠀ ⠀ ⠀ ⠀ ⠀ ⠀ Отправить аппеляцию ⠀ ⠀ ⠀ ⠀ ⠀ ⠀ ⠀ ⠀ ⠀ ⠀'))
        ]
    }

    createUserSelectRow(customId: string, options: { min_values?: number, max_values?: number } = {}) {
        return [
            new ActionRowBuilder<UserSelectMenuBuilder>()
            .addComponents(
                new UserSelectMenuBuilder(options)
                .setPlaceholder('Выберите пользователя...')
                .setCustomId(customId)
            )
        ]
    }

    set(id: string) {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(this.buttonSecondary(`set.${id}`).setLabel('Оставить заявку!'))
        ]
    }

    chooseSet(id: string, userId: string) {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonPrimary(`agreeSet.${id}.${userId}`).setLabel('Принять'),
                this.buttonSecondary(`refuseSet.${id}.${userId}`).setLabel('Отклонить')
            )
        ]
    }

    choose(endsWith?: string, refuseId: string = '') {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(this.buttonSuccess(`agree${endsWith || ''}`).setLabel('Принять'))
            .addComponents(this.buttonDanger(refuseId === '' ? `refuse${endsWith || ''}` : refuseId).setLabel('Отклонить'))
        ]
    }

    leave() {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(this.buttonPrimary('leave').setLabel('Назад'))
        ]
    }

    manageTicket(messageId: string) {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonSecondary(`closeTicket.${messageId}`).setEmoji(this.client.config.emojis.close),
                this.buttonSecondary(`transferTicket.${messageId}`).setEmoji(this.client.config.emojis.transfer),
                this.buttonSecondary(`addMemberInTicket.${messageId}`).setEmoji(this.client.config.emojis.addUser),
                this.buttonSecondary(`removeMemberInTicket.${messageId}`).setEmoji(this.client.config.emojis.removeUser)
            )
        ]
    }

    closeTicket(messageId: string) {
        return [
            new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                this.buttonPrimary(`agreeCloseTicket.${messageId}`).setLabel('Закрыть тикет')
            )
        ]
    }

    paginator(array: any[], endWith: string | undefined, count: number, leave: boolean = false, page: number = 0, trash: boolean = false) {        
        const row1 = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(`back${endWith ? `.${endWith}` : '' }`).setLabel('Назад')
        )

        if(trash) {
            row1.addComponents(
                new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(`trash`).setLabel('Удалить')
            )
        }

        row1.addComponents(
            new ButtonBuilder().setStyle(ButtonStyle.Secondary).setCustomId(`forward${endWith ? `.${endWith}` : '' }`).setLabel('Вперед')
        )

        const row2 = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId(`leave${endWith ? `.${endWith}` : '' }`).setLabel('Вернуться назад')
        )

        const max = Math.ceil(array.length/count) === 0 ? 1 : Math.ceil(array.length/count)

        if((page+1) >= max || max === 1) {
            row1.components[trash ? 2 : 1].setDisabled(true)
        } else {
            row1.components[trash ? 2 : 1].setDisabled(false)
        }

        if(1 > page) {
            row1.components[0].setDisabled(true)
        } else {
            row1.components[0].setDisabled(false)
        }

        return leave ? [ row1, row2 ] : [ row1 ]
    }

    history(array: IHistory[], page: number, isModerator: boolean) {
        if(isModerator) {
            const row = new ActionRowBuilder<ButtonBuilder>()

            for ( let i = page*5; (i < array.length && i < 5*(page+1)) ; i++ ) {
                row.addComponents(
                    this.buttonSecondary(`delete.${array[i].createdTimestamp}`).setLabel(String(i+1)).setEmoji(this.client.config.emojis.trash)
                )
            }
            
            if(array.length === 0) {
                return this.paginator(array, undefined, 5, false, page, true)
            } else {
                return [
                    row,
                    ...this.paginator(array, undefined, 5, false, page, true)
                ]
            }
        }
        else {
            return this.paginator(array, undefined, 5, false, page, true)
        }
    }
}