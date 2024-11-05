export default {
    actionCrashTypes: [
        'AddBot', 'CreateChannel', 'DeleteChannel', 'EditChannel',
        'EditEmoji', 'EditGuildBanner', 'EditGuildIcon', 'EditGuildName',
        'EditGuildLink', 'MemberBan', 'AddRoleDefault', 'AddMemberRoleAdmin',
        'MemberKick', 'EditNicknames', 'RemoveRole', 'MemberTimeout',
        'MemberUnban', 'MentionGuild', 'CreateRole', 'CreateAdminRole', 
        'DeleteRole', 'AddRoleAdminPerms', 'EditRole', 'CreateWebhook'
    ],

    auditTypes: [
        'GuildMemberAdd', 'GuildMemberRemove', 'GuildBotAdd', 'GuildBotRemove',
        'GuildUpdate', 'VoiceStateJoin', 'VoiceStateLeave', 'VoiceStateUpdate',
        'ChannelCreate', 'ChannelUpdate', 'ChannelDelete', 'EmojiCreate',
        'EmojiDelete', 'EmojiUpdate', /*'StickerCreate', 'StickerDelete',
        'StickerUpdate',*/ 'RoleCreate', 'RoleDelete', 'RoleUpdate',
        'InviteCreate', 'InviteDelete', 'GuildBanAdd', 'GuildBanRemove',
        'GuildMuteAdd', 'GuildMuteRemove', 'MessageDelete', 'MessageUpdate',
        /*'GuildScheduledEventCreate', 'GuildScheduledEventDelete', 'GuildScheduledEventUpdate',*/
        'GuildMemberNicknameUpdate', 'GuildMemberRoleAdd', 'GuildMemberRoleRemove', 'PresenceStatus'
    ],

    clusters: {
        '1': 'Fate',
        '2': 'Infinite',
        '3': 'Earth',
        '4': 'Mars',
        '5': 'Jupiter',
        '6': 'Saturn',
        '7': 'Uranus',
        '8': 'Neptune'
    }
}