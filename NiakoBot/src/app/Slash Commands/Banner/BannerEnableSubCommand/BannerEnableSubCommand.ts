import { NiakoClient } from "../../../../struct/client/NiakoClient";
import { CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, lang: string) => {
    if(!client.canvas.guildTiers.includes(interaction.guild.premiumTier)) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Включение модуля баннера',
                    `На вашем **сервере** недостаточный **уровень** Discord буста`, true
                )
            ]
        })
    }

    const doc = await client.db.modules.banner.get(interaction.guildId)

    doc.state = true
    await client.db.modules.banner.save(doc)

    return interaction.editReply({
        embeds: [
            client.storage.embeds.success(
                interaction.member, 'Включение модуля баннера',
                `Вы **включили** модуль **обновления** баннера`, true
            )
        ]
    })
}