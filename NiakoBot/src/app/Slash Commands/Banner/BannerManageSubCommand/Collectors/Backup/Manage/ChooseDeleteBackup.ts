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

    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, 'Удаление бэкапа',
                `Вы **уверены**, что хотите **удалить** бэкап **${backup.name}**?\nДля **согласия** нажмите на ${client.config.emojis.agree}, для **отказа** - ${client.config.emojis.refuse}`
            )
        ],
        components: client.storage.components.choose(`DeleteBackup.${backup._id}`, `backups`),
        files: []
    })
}