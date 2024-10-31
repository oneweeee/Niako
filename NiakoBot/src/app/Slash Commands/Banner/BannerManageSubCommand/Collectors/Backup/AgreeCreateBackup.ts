import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import { CommandInteraction, ModalSubmitInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, modal: ModalSubmitInteraction<'cached'>, lang: string) => {
    await interaction.editReply({
        embeds: [ client.storage.embeds.loading(lang) ],
        components: []
    })

    await modal.deferUpdate().catch(() => {})
    
    const array = await client.db.backups.getMemberBackups(interaction.member)

    if(array.length >= 10) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Создание бэкапа',
                    `Вы **не** можете создавать **более** чем **5** бэкапов на **сервер** или **пользователя**`
                )
            ],
            components: client.storage.components.leave('backups', lang)
        })
    }
    
    const type = modal.customId.split('.')[1]
    const name = modal.fields.getTextInputValue('name')

    const doc = await client.db.modules.banner.get(interaction.guildId)

    await client.db.backups.create(
        {
            id: (type === 'User' ? interaction.member.id : interaction.guildId),
            createrId: interaction.member.id, name, type: type as any, bannerType: doc.type, status: doc.status,
            items: doc.items, background: doc.background, updated: doc.updated, activeUserUpdated: doc.activeUserUpdated
        }
    )

    return interaction.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Создание бэкапа',
                `Вы **создали** бэкап под названием **${name}**`
            )
        ],
        components: client.storage.components.leave('backups', lang)
    })
}