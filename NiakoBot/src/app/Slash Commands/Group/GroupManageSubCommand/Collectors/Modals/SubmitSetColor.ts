import { ColorResolvable, CommandInteraction, ModalSubmitInteraction } from "discord.js";
import { NiakoClient } from "../../../../../../struct/client/NiakoClient";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
    await modal.deferReply({ ephemeral: true })
    
    const doc = await client.db.modules.group.get(interaction.guildId)

    const color = modal.fields.getTextInputValue('color')

    if(!color.startsWith('#') || color.length !== 7) {
        return modal.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Цвет панели',
                    'Вы **должны** указать **HEX-код** цвета размером в **7** символов'
                )
            ],
        })
    }

    await interaction.editReply({
        embeds: [ client.storage.embeds.loading(lang) ],
        components: []
    })

    doc.color = color as ColorResolvable

    await client.db.modules.group.sendNewMessageInGroupChannel(interaction.guild, doc)

    await interaction.editReply({
        embeds: [ client.storage.embeds.manageGroupConfig(interaction.member) ],
        components: client.storage.components.manageGroupConfig()
    })

    return modal.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Цвет панели',
                `Вы **изменили** цвет **панели управления** на **${color}**`, true
            )
        ],
    })
}