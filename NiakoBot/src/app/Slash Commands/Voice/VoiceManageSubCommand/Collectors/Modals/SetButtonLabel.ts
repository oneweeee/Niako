import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import { CommandInteraction, ModalSubmitInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
    await modal.deferReply({ ephemeral: true })

    const key = modal.customId.split('.')[1] as any
    
    const doc = await client.db.modules.voice.get(interaction.guildId)
    const config = client.db.modules.voice.getButtonConfig(doc, key)

    const label = modal.fields.getTextInputValue('label')

    if(!config.emoji && !label) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.success(
                    interaction.member, 'Этикетка кнопки',
                    `Вы **не** можете убрать **этикетку**, когда не установлено **эмодзи**`, true
                )
            ],
        })
    }

    await interaction.editReply({
        embeds: [ client.storage.embeds.loading(lang) ],
        components: []
    })


    config.label = label ? label : undefined
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
                interaction.member, 'Этикетка кнопки',
                label ? `Вы **изменили** этикетку **${key}** на **${label}**` : `Вы **сбросили** этикетку на **${key}**`, true
            )
        ],
    })
}