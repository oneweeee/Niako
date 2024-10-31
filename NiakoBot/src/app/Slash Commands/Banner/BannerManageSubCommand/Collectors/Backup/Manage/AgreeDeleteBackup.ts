import { NiakoClient } from "../../../../../../../struct/client/NiakoClient";
import { ButtonInteraction, CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, button: ButtonInteraction<'cached'>, lang: string) => {    
    const backup = await client.db.backups.get(button.customId.split('.')[1])

    if(!backup) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Удаление бэкапа',
                    `Данные об **этом** бэкапе **не** найдены`
                )
            ],
            components: client.storage.components.leave('backups', lang),
            files: []
        })
    }

    await backup.remove()

    return interaction.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Удаление бэкапа',
                `Вы **удалили** бэкап под названием **${backup.name}**`
            )
        ],
        components: client.storage.components.leaveBack('backups', lang),
        files: []
    })
}