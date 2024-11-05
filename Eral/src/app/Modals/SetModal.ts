import { ModalSubmitInteraction } from "discord.js";
import BaseInteraction from "../../struct/base/BaseInteraction";
import RuslanClient from "../../struct/client/Client";

export default new BaseInteraction(
    'set',
    async (client: RuslanClient, modal: ModalSubmitInteraction<'cached'>) => {
        await modal.deferReply({ ephemeral: true })

        const channel = modal.guild.channels.cache.get(client.config.meta.setId)
        if(channel && channel.isTextBased()) {
            const id = modal.customId.split('.')[1]
            client.db.set.set(`${modal.user.id}.${id}`, Math.round(Date.now() + (60 * 1000 * 60 * 12)))
            switch(id) {
                case client.config.meta.moderatorId:
                    await channel.send({
                        embeds: [
                            client.storage.embeds.color()
                            .setAuthor(
                                {
                                    name: `${modal.user.username}`,
                                    iconURL: client.util.getAvatar(modal.user)
                                }
                            ).addFields(
                                {
                                    name: '> Как мы к Вам можем обращаться?',
                                    value: client.util.toCode(modal.fields.getTextInputValue('name'))
                                },
                                {
                                    name: '> Сколько Вам лет?',
                                    value: client.util.toCode(modal.fields.getTextInputValue('age'))
                                },
                                {
                                    name: '> Знаете ли наши условия и конфиденциальность?',
                                    value: client.util.toCode(modal.fields.getTextInputValue('conf'))
                                },
                                {
                                    name: '> На сколько Вы знаете ниако?',
                                    value: client.util.toCode(modal.fields.getTextInputValue('niako'), 'fix')
                                }
                            ).setFooter({ text: `Id: ${modal.user.id}` }).setTimestamp()
                        ],
                        components: client.storage.components.chooseSet(id, modal.user.id)
                    })
                    break
                case client.config.meta.managerId:
                    await channel.send({
                        embeds: [
                            client.storage.embeds.color()
                            .setAuthor(
                                {
                                    name: `${modal.user.username}`,
                                    iconURL: client.util.getAvatar(modal.user)
                                }
                            ).addFields(
                                {
                                    name: '> Как мы к Вам можем обращаться?',
                                    value: client.util.toCode(modal.fields.getTextInputValue('name'))
                                },
                                {
                                    name: '> Сколько Вам лет?',
                                    value: client.util.toCode(modal.fields.getTextInputValue('age'))
                                },
                                {
                                    name: '> На сколько Вы грамотный?',
                                    value: client.util.toCode(modal.fields.getTextInputValue('graf'))
                                },
                                {
                                    name: '> На сколько Вы знаете ниако?',
                                    value: client.util.toCode(modal.fields.getTextInputValue('niako'), 'fix')
                                }
                            ).setFooter({ text: `Id: ${modal.user.id}` }).setTimestamp()
                        ],
                        components: client.storage.components.chooseSet(id, modal.user.id)
                    })
                    break    
            }
        }

        return modal.editReply({ content: `Ваш **ответ** записан. Я **обязательно** сообщу Ваш **статус** заявки в **личные** сообщения!` })
    }
)