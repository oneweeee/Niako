import { NiakoClient } from "../../../../../../struct/client/NiakoClient";
import { CommandInteraction, ButtonInteraction } from "discord.js";

export default async (client: NiakoClient, interaction: CommandInteraction<'cached'>, button: ButtonInteraction<'cached'>, lang: string) => {

    if(button.customId.includes('boostpack')) {
        const guildLevel = client.db.boosts.getGuildLevelById(interaction.guildId)
        if(1 > guildLevel && !client.db.badges.partners.has(interaction.guildId)) {
            return interaction.editReply({
                embeds: [ client.storage.embeds.needLevel(1) ],
                components: client.storage.components.leaveBack('setBackground', lang, false, true),
                files: []
            })
        }
    }

    const pack = button.customId.split('.')[1]

    switch(pack) {
        case 'TechnologiePack':
        case 'AvenuePack':
        case 'SpacePack':
        case 'LitePack':
            return interaction.editReply({
                embeds: [
                    client.storage.embeds.default(
                        interaction.member, 'Выбор стиля',
                        'Выберите один из **понравившихся** Вам **стилей** ниже'
                    )
                ],
                components: client.storage.components.choosePackStyle(pack, client.canvas.packs.getStyles(pack), lang),
                files: []
            })
        default:
            return button.reply({ embeds: [
                client.storage.embeds.error(
                    interaction.member, 'Выбор пака',
                    `Я не нашла пак **${pack}**...`
                )
            ],
            ephemeral: true
        })
    }
}