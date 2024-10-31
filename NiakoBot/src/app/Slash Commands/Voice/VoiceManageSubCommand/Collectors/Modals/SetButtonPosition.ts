import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import { CommandInteraction, ModalSubmitInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
    await modal.deferReply({ ephemeral: true })

    const key = modal.customId.split('.')[1] as any
    
    const doc = await client.db.modules.voice.get(interaction.guildId)
    const config = client.db.modules.voice.getButtonConfig(doc, key)

    const row = modal.fields.getTextInputValue('row')
    const button = modal.fields.getTextInputValue('button')

    if(client.util.isNumber(row, { maxChecked: 3, minChecked: 0 }) || client.util.isNumber(button, { maxChecked: 5, minChecked: 1 })) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Позиция кнопки',
                    `Неправильно указаны позиции кнопки\n> По ряду максимум **4**, минимум **0**\n> По месту максимум **5**, минимум **1**`
                )
            ]
        })
    }

    await interaction.editReply({
        embeds: [ client.storage.embeds.loading(lang) ],
        components: []
    })

    config.position.row = Number(row)
    config.position.button = Number(button)
    doc.type = 'Custom'
    doc.markModified('buttons')
    await client.db.modules.voice.save(doc)

    await client.db.modules.voice.sendNewMessageInPrivateChannel(interaction.guild, doc)

    await interaction.editReply({
        embeds: [ client.storage.embeds.roomManageButton(interaction.member, config) ],
        components: client.storage.components.manageRoomButton(config)
    })

    return modal.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Позиция кнопки',
                `Вы **изменили** позицию кнопки`, true
            )
        ],
    })
}