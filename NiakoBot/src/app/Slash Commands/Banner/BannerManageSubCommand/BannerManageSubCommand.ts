import { NiakoClient } from "../../../../struct/client/NiakoClient";
import { AttachmentBuilder, CommandInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, lang: string) => {
    await interaction.editReply({
        embeds: [ client.storage.embeds.loading(lang) ],
        components: [],
        files: []
    })

    /*const doc = await client.db.modules.banner.get(interaction.guildId)

    const res = await client.canvas.drawStaticBanner(interaction.guild, doc, client.canvas.checkBackground(doc))
    const att = new AttachmentBuilder(res.buffer, { name: 'Banner.png' })

    const message = await interaction.editReply({
        embeds: [
            client.storage.embeds.color()
            .setImage(`attachment://${att.name}`)
        ],
        components: client.storage.components.manageBanner(interaction.member, doc, lang),
        files: [ att ]
    })

    client.storage.collectors.interaction(
        interaction, message,
        async (int) => {
            if(int.isButton()) {
                switch(int.customId) {
                    case 'manage':
                        await (await import('./Collectors/ManageControlMenu')).default(client, interaction, int, lang)
                        break
                    case 'leaveToBackgrounds':
                    case 'setAnyBackground':
                    case 'setBackground':
                        await (await import('./Collectors/Fone/SetBannerBackground')).default(client, interaction, int, lang)
                        break
                    case 'updateTime':
                        await (await import('./Collectors/Time/SelectChooseTimeEdit')).default(client, interaction, lang)
                        break
                    case 'backups':
                        await (await import('./Collectors/Backup/SelectBackupAction')).default(client, interaction, lang)
                        break
                    case 'backupUpload':
                        await (await import('./Collectors/Backup/SelectTypeBackup')).default(client, interaction, lang)
                        break
                    case 'setAlarmBackground':
                        await (await import('./Collectors/Fone/ChooseAlarmBannerBackground')).default(client, interaction, lang)
                        break
                    case 'setDefaultStatus':
                        await (await import('./Collectors/Status/SubmitStatus')).default(client, interaction, int, lang)
                        break
                    case 'setBannerTimezone':
                        await (await import('./Collectors/Time/SelectChooseTimezone')).default(client, interaction, lang)
                        break
                    case 'setActiveType':
                        await (await import('./Collectors/ActiveType/SelectActiveType')).default(client, interaction, lang)
                        break
                    case 'setType':
                        await (await import('./Collectors/Type/SelectBannerType')).default(client, interaction, lang)
                        break
                    default:
                        const customId = int.customId.split('.')[0]
                        switch(customId) {
                            case 'manageText':
                                await (await import('./Collectors/Text/ManageText')).default(client, interaction, int, lang)
                                break
                            case 'setTextCoordinate':
                                await (await import('./Collectors/Text/Editing/SubmitCoordinate')).default(client, interaction, int, lang)
                                break
                            case 'setTextAngle':
                                await (await import('./Collectors/Text/Editing/SubmitAngle')).default(client, interaction, int, lang)
                                break
                            case 'setTextColor':
                                await (await import('./Collectors/Text/Editing/SubmitColor')).default(client, interaction, int, lang)
                                break
                            case 'setTextSize':
                                await (await import('./Collectors/Text/Editing/SubmitSize')).default(client, interaction, int, lang)
                                break
                            case 'setTextFont':
                                await (await import('./Collectors/Text/Editing/SelectFont')).default(client, interaction, int, lang)
                                break
                            case 'setTextTimezone':
                                await (await import('./Collectors/Text/Editing/SelectTimezone')).default(client, interaction, int, lang)
                                break
                            case 'setTextWidth':
                                await (await import('./Collectors/Text/Editing/SubmitWidth')).default(client, interaction, int, lang)
                                break
                            case 'setTextAlignAndBaseline':
                                await (await import('./Collectors/Text/Editing/SelectAlignAndBaseline')).default(client, interaction, int, lang)
                                break
                            case 'editText':
                                await (await import('./Collectors/Text/Editing/SelectEditText')).default(client, interaction, int, lang)
                                break
                            case 'setTextDisable':
                                await (await import('./Collectors/Text/Other/TextDisable')).default(client, interaction, int, lang)
                                break
                            case 'deleteText':
                                await (await import('./Collectors/Text/Other/ChooseDeleteText')).default(client, interaction, int, lang)
                                break
                            case 'agreeDeleteText':
                                await (await import('./Collectors/Text/Other/AgreeDeleteText')).default(client, interaction, int, lang)
                                break
                            case 'manageImage':
                                await (await import('./Collectors/Image/ManageImage')).default(client, interaction, int, lang)
                                break
                            case 'setImageCoordinate':
                                await (await import('./Collectors/Image/Editing/SubmitCoordinate')).default(client, interaction, int, lang)
                                break
                            case 'setImageIndex':
                                await (await import('./Collectors/Image/Manage/SetImageIndex')).default(client, interaction, int, lang)
                                break
                            case 'setImageShape':
                                await (await import('./Collectors/Image/Manage/SetImageShape')).default(client, interaction, int, lang)
                                break
                            case 'setImageProportions':
                                await (await import('./Collectors/Image/Editing/SubmitProportions')).default(client, interaction, int, lang)
                                break
                            case 'setImageName':
                                await (await import('./Collectors/Image/Editing/SubmitName')).default(client, interaction, int, lang)
                                break
                            case 'setImageUrl':
                                await (await import('./Collectors/Image/Editing/SubmitUrl')).default(client, interaction, int, lang)
                                break
                            case 'setImageDisable':
                                await (await import('./Collectors/Image/Other/ImageDisable')).default(client, interaction, int, lang)
                                break
                            case 'deleteImage':
                                await (await import('./Collectors/Image/Other/ChooseDeleteImage')).default(client, interaction, int, lang)
                                break
                            case 'agreeDeleteImage':
                                await (await import('./Collectors/Image/Other/AgreeDeleteImage')).default(client, interaction, int, lang)
                                break
                            case 'boostpack':
                            case 'pack':
                                await (await import('./Collectors/Fone/ChoosePackStyles')).default(client, interaction, int, lang)
                                break
                            case 'backupLoad':
                                await (await import('./Collectors/Backup/Manage/LoadBackupOnServer')).default(client, interaction, int, lang)
                                break
                            case 'deleteBackup':
                                await (await import('./Collectors/Backup/Manage/ChooseDeleteBackup')).default(client, interaction, int, lang)
                                break
                            case 'agreeDeleteBackup':
                                await (await import('./Collectors/Backup/Manage/AgreeDeleteBackup')).default(client, interaction, int, lang)
                                break
                        }
                }
            } else if(int.isStringSelectMenu()) {
                switch(int.customId) {
                    case 'manageText':
                        await (await import('./Collectors/Text/AddTextTypeOrManage')).default(client, interaction, int, lang)
                        break
                    case 'addText':
                        await (await import('./Collectors/Text/AddNewTextOnBanner')).default(client, interaction, int, lang)
                        break
                    case 'manageImage':
                        await (await import('./Collectors/Image/AddImageTypeOnManage')).default(client, interaction, int, lang)
                        break
                    case 'addImage':
                        await (await import('./Collectors/Image/AddNewImageOnBanner')).default(client, interaction, int, lang)
                        break
                    case 'setBannerType':
                        await (await import('./Collectors/Type/SetBannerType')).default(client, interaction, int, lang)
                        break
                    case 'chooseSetActiveType':
                        await (await import('./Collectors/ActiveType/SetActiveType')).default(client, interaction, int, lang)
                        break
                    case 'chooseBannerUpdate':
                        await (await import('./Collectors/Time/SetBannerUpdate')).default(client, interaction, int, lang)
                        break
                    case 'chooseActiveUpdate':
                        await (await import('./Collectors/Time/SetActiveUpdate')).default(client, interaction, int, lang)
                        break
                    case 'chooseBannerTimezone':
                        await (await import('./Collectors/Time/SetGuildTimezone')).default(client, interaction, int, lang)
                        break
                    case 'setAlarmBackgrounds':
                        await (await import('./Collectors/Fone/SelectAlarmBackgrounds')).default(client, interaction, int, lang)
                        break
                    case 'chooseBackupType':
                        await (await import('./Collectors/Backup/SubmitCreateBackup')).default(client, interaction, int, lang)
                        break
                    case 'editBannerBackup':
                        await (await import('./Collectors/Backup/Manage/OpenBackupManage')).default(client, interaction, int, lang)
                        break
                    case 'chooseBannerTimezone':
                        await (await import('./Collectors/Time/SetGuildTimezone')).default(client, interaction, int, lang)
                        break
                    default:
                        const customId = int.customId.split('.')[0]
                        switch(customId) {
                            case 'chooseTimezone':
                                await (await import('./Collectors/Text/Manage/SetTextTimezone')).default(client, interaction, int, lang)
                                break
                            case 'chooseTextFont':
                                await (await import('./Collectors/Text/Manage/SetTextFont')).default(client, interaction, int, lang)
                                break
                            case 'chooseTextAlign':
                                await (await import('./Collectors/Text/Manage/SetTextAlign')).default(client, interaction, int, lang)
                                break
                            case 'chooseTextBaseline':
                                await (await import('./Collectors/Text/Manage/SetTextBaseline')).default(client, interaction, int, lang)
                                break
                            case 'editText':
                                await (await import('./Collectors/Text/Manage/SetOrSubmitEditText')).default(client, interaction, int, lang)
                                break
                            case 'setPackStyle':
                                await (await import('./Collectors/Fone/AgreeEditBannerStyle')).default(client, interaction, int, lang)
                                break
                        }
                }
            } else if(int.isModalSubmit()) {
                switch(int.customId) {
                    case 'modalWindowAddDefaultText':
                        await (await import('./Collectors/Text/AddDefaultTextOnBanner')).default(client, interaction, int, lang)
                        break
                    case 'modalWindowAddImage':
                        await (await import('./Collectors/Image/AddImageOnBanner')).default(client, interaction, int, lang)
                        break
                    case 'modalWindowAddActiveMemberAvatar':
                        await (await import('./Collectors/Image/AddActiveAvatarOnBanner')).default(client, interaction, int, lang)
                        break
                    case 'modalWindowSetBackground':
                        await (await import('./Collectors/Fone/SetBannerAnyBackground')).default(client, interaction, int, lang)
                        break
                    case 'modalWindowSetDefaultStatus':
                        await (await import('./Collectors/Status/SetDefaultStatus')).default(client, interaction, int, lang)
                        break
                    default:
                        const customId = int.customId.split('.')[0]
                        switch(customId) {
                            case 'modalWindowSetTextCoordinate':
                                await (await import('./Collectors/Text/Manage/SetTextCoordinate')).default(client, interaction, int, lang)
                                break
                            case 'modalWindowSetTextAngle':
                                await (await import('./Collectors/Text/Manage/SetTextAngle')).default(client, interaction, int, lang)
                                break
                            case 'modalWindowSetTextColor':
                                await (await import('./Collectors/Text/Manage/SetTextColor')).default(client, interaction, int, lang)
                                break
                            case 'modalWindowSetTextSize':
                                await (await import('./Collectors/Text/Manage/SetTextSize')).default(client, interaction, int, lang)
                                break
                            case 'modalWindowSetTextWidth':
                                await (await import('./Collectors/Text/Manage/SetTextWidth')).default(client, interaction, int, lang)
                                break
                            case 'modalWindowEditTextSize':
                                await (await import('./Collectors/Text/Manage/AgreeEditCustomText')).default(client, interaction, int, lang)
                                break
                            case 'modalWindowSetImageCoordinate':
                                await (await import('./Collectors/Image/Manage/SetImageCoordinate')).default(client, interaction, int, lang)
                                break
                            case 'modalWindowSetImageProportions':
                                await (await import('./Collectors/Image/Manage/SetImageProportions')).default(client, interaction, int, lang)
                                break
                            case 'modalWindowSetImageName':
                                await (await import('./Collectors/Image/Manage/SetImageName')).default(client, interaction, int, lang)
                                break
                            case 'modalWindowSetImageUrl':
                                await (await import('./Collectors/Image/Manage/SetImageUrl')).default(client, interaction, int, lang)
                                break
                            case 'modalWindowSetBackgrounds':
                                await (await import('./Collectors/Fone/SetAlarmBackgrounds')).default(client, interaction, int, lang)
                                break
                            case 'modalWindowCreateBackupName':
                                await (await import('./Collectors/Backup/AgreeCreateBackup')).default(client, interaction, int, lang)
                                break
                        }
                }
            }
        }
    )*/
}