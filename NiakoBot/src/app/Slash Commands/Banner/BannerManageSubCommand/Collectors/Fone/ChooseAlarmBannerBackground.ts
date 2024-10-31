import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import { CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, lang: string) => {
    const doc = await client.db.modules.banner.get(interaction.guildId)
    return interaction.editReply({
        embeds: [
            client.storage.embeds.default(
                interaction.member, 'Установка временных фонов',
                'Вы **можете** установить фон на **разное** время!'
            )
        ],
        components: client.storage.components.chooseAlarmSetBackground(doc, lang),
        files: []
    })
}