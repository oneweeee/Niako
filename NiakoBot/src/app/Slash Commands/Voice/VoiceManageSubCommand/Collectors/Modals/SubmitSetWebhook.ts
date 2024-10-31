import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import { CommandInteraction, ModalSubmitInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
    await modal.deferReply({ ephemeral: true })
    
    const doc = await client.db.modules.voice.get(interaction.guildId)

    const name = (modal.fields.getTextInputValue('name') || client.user.username)
    const avatar = (modal.fields.getTextInputValue('avatar') || `${__dirname}/../../../../../../../assets/images/Logo.png`)

    if(avatar.startsWith('https://')) {
        const formates = client.canvas.imageFormates.find((format) => avatar.endsWith(format))
        if(!formates) {
            return modal.editReply({
                embeds: [
                    client.storage.embeds.error(
                        interaction.member, 'Настройка вебхука',
                        `Ссылка **должна** заканчиваться на **один** из этих вариантов: ${client.canvas.imageFormates.map((f) => `**${f}**`).join(', ')}`
                    )
                ]
            })
        }

        const state = await client.canvas.loadImageState(avatar)
        if(!state) {
            return modal.editReply({
                embeds: [
                    client.storage.embeds.error(
                        interaction.member, 'Настройка вебхука',
                        `Ссылка **недействительна** или **устарела**`
                    )
                ]
            })
        }
    }

    await interaction.editReply({
        embeds: [ client.storage.embeds.loading(lang) ],
        components: []
    })

    let text = ''
    if(doc.webhook.username !== name) {
        doc.webhook.username = name
        text = `Вы установили название вебхука **${name}**`
    }

    if(doc.webhook.avatar !== avatar) {
        doc.webhook.avatar = avatar
        if(text === '') text = `Вы **установили** название вебхука **${name}**`
        else text += ` и  ${avatar.startsWith('https://') ? `[аватар](${avatar})` : '**аватар**'}`
    }

    if(text === '') {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Настройка вебхука',
                    'Вы ничего не изменнили...'
                )
            ],
        })
    }

    await client.db.modules.voice.sendNewMessageInPrivateChannel(interaction.guild, doc, { webhookEdit: true })

    await interaction.editReply({
        embeds: [ client.storage.embeds.manageRoomConfig(interaction.member) ],
        components: client.storage.components.manageRoomConfig(doc)
    })

    return modal.editReply({
        embeds: [ client.storage.embeds.success(interaction.member, 'Настройка вебхука', text, true) ],
    })
}