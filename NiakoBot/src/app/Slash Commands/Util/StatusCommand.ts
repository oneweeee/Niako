import BaseSlashCommand from "../../../struct/base/BaseSlashCommand";
import { ApplicationCommandOptionType } from "discord.js";

export default new BaseSlashCommand(
    'status',
    {
        disabled: true,
        module: 'util',
        name: 'status',
        description: 'Установить статус на серверный баннер',
        detailedDescription: 'Позволяет установить свой статус на сервер баннера',

        options: [
            {
                name: 'status',
                description: 'Статус, который хотите себе установить',
                detailedDescription: 'Статус, который хотите себе установить',
                type: ApplicationCommandOptionType.String,
                maxLength: 64
            }
        ]
    },

    async (client, interaction, lang) => {
        await interaction.deferReply({ ephemeral: true })

        const doc = await client.db.modules.banner.get(interaction.guildId)
        if(!doc.state) {
            return interaction.editReply({
                embeds: [
                    client.storage.embeds.error(
                        interaction.member, 'Установить статус',
                        'Модуль **баннера** сейчас **выключен** на сервере', true
                    )
                ],
            })
        }

        if(doc.activeUserId !== interaction.user.id) {
            return interaction.editReply({
                embeds: [
                    client.storage.embeds.error(
                        interaction.member, 'Установить статус',
                        'Вы **не** самый активный участник', true
                    )
                ],
            })
        }

        const status = ((interaction.options.get('status')?.value as string) || doc.status)

        doc.activeUserStatus = status
        await client.db.modules.banner.save(doc)

        return interaction.editReply({
            embeds: [
                client.storage.embeds.success(
                    interaction.member, 'Установить статус',
                    `Вы **установили** статус **${status}**`, true
                )
            ],
        })
    }
)