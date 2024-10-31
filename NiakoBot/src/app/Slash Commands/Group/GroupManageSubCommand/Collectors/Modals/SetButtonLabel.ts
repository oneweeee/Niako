import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import { CommandInteraction, ModalSubmitInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
    await modal.deferReply({ ephemeral: true })

    const key = modal.customId.split('.')[1] as any
    
    const doc = await client.db.modules.group.get(interaction.guildId)
    const config = doc.buttons.find((b) => b.customId === key)!

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
    await client.db.modules.group.save(doc)

    await client.db.modules.group.sendNewMessageInGroupChannel(interaction.guild, doc)

    await interaction.editReply({
        embeds: [ client.storage.embeds.groupManageButton(interaction.member, config) ],
        components: client.storage.components.groupManageButton(config)
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