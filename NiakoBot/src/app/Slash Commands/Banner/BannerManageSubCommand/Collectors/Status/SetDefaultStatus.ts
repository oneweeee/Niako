import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import { CommandInteraction, ModalSubmitInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
    const doc = await client.db.modules.banner.get(interaction.guildId)

    const status = modal.fields.getTextInputValue('status')

    if(doc.status === doc.activeUserStatus) {
        doc.activeUserStatus = status
    }
    doc.status = status
    await client.db.modules.banner.save(doc)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Статус по умолчанию',
                `Вы **изменили** статус по умолчанию на **${status}**`
            )
        ],
        components: client.storage.components.leaveBack('manage', lang),
        files: []
    })
}