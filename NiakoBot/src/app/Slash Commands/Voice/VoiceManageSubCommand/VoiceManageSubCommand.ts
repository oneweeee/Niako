import { NiakoClient } from "../../../../struct/client/NiakoClient";
import { CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, lang: string) => {
    const doc = await client.db.modules.voice.get(interaction.guildId)

    if(!doc.state) {
        return interaction.editReply({
            embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Настройка приватных каналов',
                    `У Вас **нет** созданных **комнат**`, true
                )
            ]
        })
    }

    const message = await interaction.editReply({
        embeds: [ client.storage.embeds.manageRoomConfig(interaction.member) ],
        components: client.storage.components.manageRoomConfig(doc)
    })

    return client.storage.collectors.interaction(
        interaction, message,
        async (int) => {
            if(int.isButton()) {
                switch(int.customId) {
                    case 'leave':
                        const doc = await client.db.modules.voice.get(interaction.guildId)
                    
                        return interaction.editReply({
                            embeds: [ client.storage.embeds.manageRoomConfig(interaction.member) ],
                            components: client.storage.components.manageRoomConfig(doc)
                        })
                    case 'setRoomGame':
                        return (await import('./Collectors/Buttons/SetGameMode')).default(client, interaction, int, lang)
                    case 'setRoomDefault':
                        return (await import('./Collectors/Buttons/ShowModalDefault')).default(client, interaction, int, lang)
                    case 'setRoomWebhook':
                        return (await import('./Collectors/Buttons/ShowModalWebhook')).default(client, interaction, int, lang)
                    case 'setRoomColor':
                        return (await import('./Collectors/Buttons/ShowModalColor')).default(client, interaction, int, lang)
                    case 'setRoomMessage':
                        return (await import('./Collectors/Buttons/ShowModalMessage')).default(client, interaction, int, lang)
                    case 'setRoomButton':
                        return (await import('./Collectors/Buttons/SelectManageButton')).default(client, interaction, lang)
                    default:
                        const customId = int.customId.split('.')[0]
                        switch(customId) {
                            case 'openManageButton':
                                return (await import('./Collectors/Buttons/OpenManageButton')).default(client, interaction, int, lang)
                            case 'manageRoomButtonStyle':
                                return (await import('./Collectors/Buttons/ButtonManageStyle')).default(client, interaction, int, lang)
                            case 'manageRoomButtonLabel':
                                return (await import('./Collectors/Buttons/ButtonManageLabel')).default(client, interaction, int, lang)
                            case 'manageRoomButtonEmoji':
                                return (await import('./Collectors/Buttons/ButtonManageEmoji')).default(client, interaction, int, lang)
                            case 'manageRoomButtonView':
                                return (await import('./Collectors/Buttons/ButtonManageUsed')).default(client, interaction, int, lang)
                            case 'manageRoomButtonPosition':
                                return (await import('./Collectors/Buttons/ButtonManagePosition')).default(client, interaction, int, lang)
                        }
                }
            } else if(int.isStringSelectMenu()) {
                switch(int.customId) {
                    case 'setRoomStyle':
                        return (await import('./Collectors/Menus/SelectPanelStyle')).default(client, interaction, int, lang)
                    case 'setRoomType':
                        return (await import('./Collectors/Menus/SelectRoomType')).default(client, interaction, int, lang)
                    case 'selectManageRoomButton':
                        return (await import('./Collectors/Menus/SelectManageButton')).default(client, interaction, int, lang)
                    default:
                        const customId = int.customId.split('.')[0]
                        switch(customId) {
                            case 'selectButtonStyle':
                                return (await import('./Collectors/Menus/SetButtonStyle')).default(client, interaction, int, lang)
                        }
                }
            } else if(int.isModalSubmit()) {
                switch(int.customId) {
                    case 'modalWindowSetDefault':
                        return (await import('./Collectors/Modals/SubmitSetDefault')).default(client, interaction, int, lang)
                    case 'modalWindowSetWebhook':
                        return (await import('./Collectors/Modals/SubmitSetWebhook')).default(client, interaction, int, lang)
                    case 'modalWindowSetColor':
                        return (await import('./Collectors/Modals/SubmitSetColor')).default(client, interaction, int, lang)
                    case 'modalWindowSetMessage':
                        return (await import('./Collectors/Modals/SubmitSetMessage')).default(client, interaction, int, lang)
                    default:
                        const customId = int.customId.split('.')[0]
                        switch(customId) {
                            case 'modalWindowSetButtonLabel':
                                return (await import('./Collectors/Modals/SetButtonLabel')).default(client, interaction, int, lang)
                            case 'modalWindowSetButtonEmoji':
                                return (await import('./Collectors/Modals/SetButtonEmoji')).default(client, interaction, int, lang)
                            case 'modalWindowSetButtonPosition':
                                return (await import('./Collectors/Modals/SetButtonPosition')).default(client, interaction, int, lang)
                        }
                }
            }
        }
    )
}