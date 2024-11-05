import { Interaction } from "discord.js";
import Client from "../../../struct/client/Client";
import BaseEvent from "../../../struct/base/BaseEvent";

export default new BaseEvent(
    {
        name: 'interactionCreate'
    },
    async (client: Client, interaction: Interaction<'cached'>) => {
        if(!interaction.channel || interaction.channel.isDMBased()) return

        if(interaction.isCommand()) {
            return client.storage.slashCommands.parseInteraction(interaction, Date.now())
        }

        if(interaction.isButton()) {
            return client.storage.buttons.parseButtonInteraction(interaction)
        }

        if(interaction.isModalSubmit()) {
            return client.storage.modals.parseModalInteraction(interaction)
        }

        if(interaction.isChannelSelectMenu()) {
            return client.storage.modals.parseChannelMenuInteraction(interaction)
        }

        if(interaction.isStringSelectMenu()) {
            return client.storage.modals.parseStringMenuInteraction(interaction)
        }

        if(interaction.isUserSelectMenu()) {
            return client.storage.modals.parseUserMenuInteraction(interaction)
        }

        if(interaction.isAutocomplete()) {
            return client.storage.slashCommands.parseAutocomplete(interaction)
        }
    }
)