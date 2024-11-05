import BaseSlashCommand from "#base/BaseSlashCommand";

export default new BaseSlashCommand(
    {
        name: 'autorole',
        description: 'Auto server roles for join',
        descriptionLocalizations: {
            'ru': 'Авто выдача ролей при входе на сервер'
        },
        category: 'settings'
    },
    async (client, interaction, { locale }) => {
        const res = await client.db.guilds.get(interaction.guildId, locale)

        if(
            interaction.guild.ownerId !== interaction.user.id &&
            !interaction.member.permissions.has('Administrator') &&
            !client.config.developers.includes(interaction.user.id)
        ) {
            return interaction.reply({ content: `${client.services.lang.get("commands.autorole.no_rights", locale)}`, ephemeral: true })
        }

        if(
            interaction.guild.members.me && !interaction.guild.members.me.permissions.has('ManageRoles')
        ) {
            return interaction.reply({ content: `${client.services.lang.get("commands.autorole.no_rights_bot", locale)}`, ephemeral: true })
        }

        await interaction.deferReply()

        const message = await interaction.editReply({
            embeds: [ client.storage.embeds.autoRoles(interaction.member, client.db.guilds.getColor(interaction.guildId), res.autoRoles, locale) ],
            components: client.storage.components.autoRoles(res.autoRoles, locale)
        })

        return client.storage.collectors.interaction(
            interaction, message, async (int) => {
                if(int.isButton()) {
                    await interaction.editReply({ embeds: [ client.storage.embeds.loading(locale, client.db.guilds.getColor(interaction.guildId)) ], components: [] })

                    const doc = await client.db.guilds.get(interaction.guildId, locale)
                    
                    doc.autoRoles = []
                    await client.db.guilds.save(doc)

                    return interaction.editReply({
                        embeds: [ client.storage.embeds.autoRoles(interaction.member, client.db.guilds.getColor(interaction.guildId), doc.autoRoles, locale) ],
                        components: client.storage.components.autoRoles(doc.autoRoles, locale)
                    })
                } else if(int.isRoleSelectMenu()) {
                    await interaction.editReply({ embeds: [ client.storage.embeds.loading(locale, client.db.guilds.getColor(interaction.guildId)) ], components: [] })

                    const doc = await client.db.guilds.get(interaction.guildId, locale)
                    
                    doc.autoRoles = int.roles.filter((r) => !r.permissions.has('Administrator') || !r.tags?.botId || !r.tags?.premiumSubscriberRole || !r.tags?.subscriptionListingId).map((r) => r.id)
                    await client.db.guilds.save(doc)

                    return interaction.editReply({
                        embeds: [ client.storage.embeds.autoRoles(interaction.member, client.db.guilds.getColor(interaction.guildId), doc.autoRoles, locale) ],
                        components: client.storage.components.autoRoles(doc.autoRoles, locale)
                    })
                }
            },
            60_000,
            async (_, reason: string) => {
                if(reason !== 'time') return
                
                return interaction.editReply({
                    embeds: [
                        client.storage.embeds.default(
                            interaction.member, client.db.guilds.getColor(interaction.guildId), `${client.services.lang.get("commands.autorole.auto_role", locale)}`, locale
                        )
                    ], components: []
                }).catch(() => {})
            }
        )
    }
)