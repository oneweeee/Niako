import { Interaction } from "discord.js"
import BaseListener from "#base/BaseListener"

export default new BaseListener(
    { name: 'interactionCreate' },
    async (client, interaction: Interaction<'cached'>) => {
        const cached = Date.now()
        if(!interaction?.guild) return
        
        return Promise.all([
            client.watchers.slashCommands.parseInteraction(interaction, cached),
            client.watchers.slashCommands.parseAutocomplete(interaction),
            client.watchers.stringMenus.parseInteraction(interaction),
            client.watchers.buttons.parseInteraction(interaction),
            client.watchers.modals.parseInteraction(interaction)
        ])
    }
)