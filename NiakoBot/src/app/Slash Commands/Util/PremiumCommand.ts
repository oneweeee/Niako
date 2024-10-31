import BaseSlashCommand from "../../../struct/base/BaseSlashCommand";
import { CollectedInteraction } from "discord.js";

export default new BaseSlashCommand(
    'premium',
    {
        module: 'util',
        name: 'premium',
        description: 'Покупка и управление бустами',
        detailedDescription: 'Панель управления Niako Boost, в которой можно получить информацию о них, управлять ими или их приоберсти'
    },

    async (client, interaction, lang) => {
        await interaction.deferReply()

        const message = await interaction.editReply({
            embeds: [ client.storage.embeds.premium(interaction.member, lang) ],
            components: client.storage.components.premium(lang)
        })

        const collector = client.storage.collectors.interaction(
            interaction, message,
            async (int: CollectedInteraction<'cached'>) => {
                if(int.isButton()) {
                    switch(int.customId) {
                        case 'leave':
                            await interaction.editReply({
                                embeds: [ client.storage.embeds.premium(interaction.member, lang) ],
                                components: client.storage.components.premium(lang)
                            })
                            break
                        case 'shop':
                            await (await import('./PremiumCommand/shop/ShopMainMenu')).default(client, interaction, lang)
                            break
                        case 'topUpBalance':
                            await (await import('./PremiumCommand/shop/OpenModalReplenishment')).default(client, int, lang)
                            break
                        case 'transactions':
                            await (await import('./PremiumCommand/shop/Transaction')).default(client, interaction, lang)
                            break
                        case 'left':
                            await (await import('./PremiumCommand/shop/TransactionLeft')).default(client, interaction, int, lang)
                            break
                        case 'right':
                            await (await import('./PremiumCommand/shop/TransactionRight')).default(client, interaction, int, lang)
                            break
                        case 'buyStar':
                            await (await import('./PremiumCommand/shop/OpenModalBuyBoostCount')).default(client, int, lang)
                            break
                        case 'manage':
                            await (await import('./PremiumCommand/manage/ManageMainMenu')).default(client, interaction, lang)
                            break
                        case 'giveBoost':
                            await (await import('./PremiumCommand/manage/OpenGuildBoostMenu')).default(client, interaction, false, lang)
                            break
                        case 'giveBoostServerInput':
                            await (await import('./PremiumCommand/manage/OpenModalInputGuildId')).default(client, int, false, lang)
                            break
                        case 'giveBoostServer':
                            await (await import('./PremiumCommand/manage/GiveBoostToServer')).default(client, interaction, interaction.guildId, int, lang)
                            break
                        case 'removeBoost':
                            await (await import('./PremiumCommand/manage/OpenGuildBoostMenu')).default(client, interaction, true, lang)
                            break
                        case 'removeBoostServerInput':
                            await (await import('./PremiumCommand/manage/OpenModalInputGuildId')).default(client, int, true, lang)
                            break
                        case 'removeBoostServer':
                            await (await import('./PremiumCommand/manage/RemoveBoostToServer')).default(client, interaction, interaction.guildId, int, lang)
                            break
                        case 'info':
                            await (await import('./PremiumCommand/info/Information')).default(client, interaction, lang)
                            break
                        default:
                            if(int.customId.startsWith('accessBuyStar')) {
                                await (await import('./PremiumCommand/shop/AccessBuyBoost')).default(client, interaction, int, lang)
                            } else if(int.customId.startsWith('extendBoost')) {
                                await (await import('./PremiumCommand/manage/ProlongBoostForMonth')).default(client, interaction, int, lang)
                            } else if(int.customId.startsWith('removeBoost')) {
                                await (await import('./PremiumCommand/manage/RemoveBoostForServer')).default(client, interaction, int, lang)
                            }
                            break
                    }
                }

                if(int.isStringSelectMenu()) {
                    switch(int.customId) {
                        case 'operationSelection':
                            await (await import('./PremiumCommand/shop/CreatingPayment')).default(client, interaction, int, lang, collector)
                            break
                        case 'infoBoost':
                            await (await import('./PremiumCommand/manage/InfoBoost')).default(client, interaction, int, lang)
                            break
                    }
                }

                if(int.isModalSubmit()) {
                    switch(int.customId) {
                        case 'modalWindowReplenishment':
                            await (await import('./PremiumCommand/shop/OperationSelection')).default(client, interaction, int, lang)
                            break
                        case 'modalWindowBoostCount':
                            await (await import('./PremiumCommand/shop/ChooseBuyBoost')).default(client, interaction, int, lang)
                            break
                        case 'modalWindowBoostAdd':
                            await (await import('./PremiumCommand/manage/GiveBoostToServer')).default(
                                client, interaction, int.fields.getTextInputValue('id'), int, lang
                            )
                            break
                        case 'modalWindowBoostRemove':
                            await (await import('./PremiumCommand/manage/RemoveBoostToServer')).default(
                                client, interaction, int.fields.getTextInputValue('id'), int, lang
                            )
                            break
                    }
                }
            }
        )
    }
)