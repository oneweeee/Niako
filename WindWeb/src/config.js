export const clientId = '973958601616015380'

export const apiUrl = 'https://api.wind-bot.xyz'

export const storage = {
    theme: 'dark', // light or dark
    locale: 'ru' // ru or en
}

export const loginUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${window.location.origin}/callback&response_type=code&scope=identify%20guilds`

export const links = {
    botInvite: `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot`,
    support: 'https://discord.gg/2gYde6hVKd',
    documentation: 'https://docs.niako.xyz/',
    stats: '/stats',
    commands: '/commands',
    donate: '/donate',
    private: '/private',
    police: '/police',
    cookie: '/cookie',
    login: '/login',
    logout: '/logout',
    servers: '/servers'
}