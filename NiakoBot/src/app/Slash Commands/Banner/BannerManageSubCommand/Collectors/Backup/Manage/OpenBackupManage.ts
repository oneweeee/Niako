import { NiakoClient } from "../../../../../../../struct/client/NiakoClient";
import { CommandInteraction, StringSelectMenuInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, menu: StringSelectMenuInteraction<'cached'>, lang: string) => {
    await interaction.editReply({ embeds: [ client.storage.embeds.loading(lang) ], components: [] })

    await menu.deferUpdate()

    const backup = await client.db.backups.get(menu.values[0])

    if(!backup) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Создание бэкапа',
                    `Я не нашла **данные** об **этом** бэкапе...`
                )
            ],
            components: client.storage.components.leave('backups', lang)
        })
    }

    const options = await client.storage.embeds.bannerManageBackup(interaction.member, backup, lang)

    return interaction.editReply({
        ...options,
        components: client.storage.components.manageBackup(String(backup._id), lang)
    })
}