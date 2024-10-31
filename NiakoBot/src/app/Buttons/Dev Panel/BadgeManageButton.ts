import { NiakoClient } from "../../../struct/client/NiakoClient";
import { ButtonInteraction } from "discord.js";
import BaseInteraction from "../../../struct/base/BaseInteraction";

export default new BaseInteraction(
    'devPanel.ManageBadges',
    async (client: NiakoClient, button: ButtonInteraction<'cached'>, lang: string) => {
        await button.deferReply({ ephemeral: true })

        return button.editReply({
            embeds: [ client.storage.embeds.default(button.member, 'Управление значками', 'Выберите, какой **категории** Вы хотите **выдать** значок?') ],
            components: client.storage.components.chooseBadgeType()
        })
    },
    {
        onlyOwner: true
    }
)