import { NiakoClient } from "../../../struct/client/NiakoClient";
import BaseEvent from "../../../struct/base/BaseEvent";
import { Interaction } from "discord.js";

export default new BaseEvent(
    {
        name: 'interactionCreate'
    },
    async (client: NiakoClient, interaction: Interaction<'cached'>) => {
        const interactionCached = Date.now()
        
        if(
            (
                client.config.debug && !client.config.owners.map((o) => o.id).includes(interaction.user.id)
            ) || !client.db.inited || !interaction.guild
        ) {
            return
        }

        if(!interaction.channel || interaction.channel.isDMBased()) return

        if(interaction.isCommand()) {
            return client.storage.slashCommands.parseInteraction(interaction, interactionCached)
        } else if(interaction.isButton()) {
            return client.storage.buttons.parseButtonInteraction(interaction)
        } else if(interaction.isStringSelectMenu()) {
            return client.storage.modals.parseStringMenuInteraction(interaction)
        } else if(interaction.isModalSubmit()) {
            return client.storage.modals.parseModalInteraction(interaction)
        } else if(interaction.isChannelSelectMenu()) {
            return client.storage.modals.parseChannelMenuInteraction(interaction)
        } else if(interaction.isUserSelectMenu()) {
            return client.storage.modals.parseUserMenuInteraction(interaction)
        }
    }
)