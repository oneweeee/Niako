import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import { CommandInteraction, ModalSubmitInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
    await modal.deferReply({ ephemeral: true })
    
    const doc = await client.db.modules.group.get(interaction.guildId)

    try {
        JSON.parse(modal.fields.getTextInputValue('embed'))
    } catch {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Сообщение панели',
                    'Нам **не** удалось **отформатировать** указанный **JSON** сообщения'
                )
            ],
        })
    }

    await interaction.editReply({
        embeds: [ client.storage.embeds.loading(lang) ],
        components: []
    })

    doc.embed = modal.fields.getTextInputValue('embed')

    await client.db.modules.group.sendNewMessageInGroupChannel(interaction.guild, doc)

    await interaction.editReply({
        embeds: [ client.storage.embeds.manageGroupConfig(interaction.member) ],
        components: client.storage.components.manageGroupConfig()
    })

    return modal.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Сообщение панели',
                `Вы **изменили** сообщение **панели управления**`, true
            )
        ],
    })
}