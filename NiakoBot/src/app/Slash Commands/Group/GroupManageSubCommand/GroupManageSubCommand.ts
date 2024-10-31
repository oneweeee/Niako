import { NiakoClient } from "../../../../struct/client/NiakoClient";
import { CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, lang: string) => {
    const doc = await client.db.modules.group.get(interaction.guildId)

    if(!doc.state) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Настройка приватных групп',
                    `У Вас **нет** созданных **групп**`, true
                )
            ]
        })
    }

    const message = await interaction.editReply({
        embeds: [ client.storage.embeds.manageGroupConfig(interaction.member) ],
        components: client.storage.components.manageGroupConfig()
    })

    return client.storage.collectors.interaction(
        interaction, message,
        async (int) => {
            if(int.isButton()) {
                switch(int.customId) {
                    case 'leave':
                        return interaction.editReply({
                            embeds: [ client.storage.embeds.manageGroupConfig(interaction.member) ],
                            components: client.storage.components.manageGroupConfig()
                        })
                    case 'setGroupWebhook':
                        return (await import('./Collectors/Buttons/ShowModalWebhook')).default(client, interaction, int, lang)
                    case 'setGroupMessage':
                        return (await import('./Collectors/Buttons/ShowModalMessage')).default(client, interaction, int, lang)
                    case 'setGroupColor':
                        return (await import('./Collectors/Buttons/ShowModalColor')).default(client, interaction, int, lang)
                    case 'setGroupButton':
                        return (await import('./Collectors/Buttons/SelectManageButton')).default(client, interaction, lang)
                    default:
                        switch(int.customId.split('.')[0]) {
                            case 'manageGroupButtonStyle':
                                return (await import('./Collectors/Buttons/ButtonManageStyle')).default(client, interaction, int, lang)
                            case 'manageGroupButtonLabel':
                                return (await import('./Collectors/Buttons/ButtonManageLabel')).default(client, interaction, int, lang)
                            case 'manageGroupButtonEmoji':
                                return (await import('./Collectors/Buttons/ButtonManageEmoji')).default(client, interaction, int, lang)    
                        }
                }
            } else if(int.isStringSelectMenu()) {
                switch(int.customId) {
                    case 'selectManageGroupButton':
                        return (await import('./Collectors/Menus/SelectManageButton')).default(client, interaction, int, lang)
                    default:
                        switch(int.customId.split('.')[0]) {
                            case 'selectButtonStyle':
                                return (await import('./Collectors/Menus/SetButtonStyle')).default(client, interaction, int, lang)
                        }
                }
            } else if(int.isModalSubmit()) {
                switch(int.customId) {
                    case 'modalWindowSetWebhook':
                        return (await import('./Collectors/Modals/SubmitSetWebhook')).default(client, interaction, int, lang)
                    case 'modalWindowSetMessage':
                        return (await import('./Collectors/Modals/SubmitSetMessage')).default(client, interaction, int, lang)
                    case 'modalWindowSetColor':
                        return (await import('./Collectors/Modals/SubmitSetColor')).default(client, interaction, int, lang)
                    default:
                        switch(int.customId.split('.')[0]) {
                            case 'modalWindowSetButtonLabel':
                                return (await import('./Collectors/Modals/SetButtonLabel')).default(client, interaction, int, lang)
                            case 'modalWindowSetButtonEmoji':
                                return (await import('./Collectors/Modals/SetButtonEmoji')).default(client, interaction, int, lang)
                        }
                }
            }
        }
    )
}