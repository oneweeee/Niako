import Avatar from './assets/imgs/Avatar.webp'

export const razbitNumber = (num) => {
    return String(num).split('').reverse().map(
        (v, i) => {
            if ((i + 1) % 3 === 0 && num.toString().length - 1 !== i) {
                return ` ${v}`
            } else {
                return v
            }
        }
    ).reverse().join('')
}

export const roundNumber = (num) => {
    if(num > 99999) {
        return Number(Math.trunc(num / 10000) + '0000')
    }

    if(num > 9999) {
        return Number(Math.trunc(num / 1000) + '000')
    }

    if(num > 99) {
        return Number(Math.trunc(num / 100) + '00')
    }

    if(num > 9) {
        return Number(Math.trunc(num / 10) + '0')
    }

    return num
}

export const getBrowser = () => {
    const agent = window.navigator.userAgent.toLowerCase();
    const browser =
        agent.indexOf('edge') > -1 ? 'edge'
        : agent.indexOf('edg') > -1 ? 'chromium based edge'
        : agent.indexOf('opr') > -1 && window.opr ? 'opera'
        : agent.indexOf('chrome') > -1 && window.chrome ? 'chrome'
        : agent.indexOf('trident') > -1 ? 'ie'
        : agent.indexOf('firefox') > -1 ? 'firefox'
        : agent.indexOf('safari') > -1 ? 'safari'
        : 'other'

    return browser
}

export const getGuildIcon = (data) => {
    if(!data?.icon) return Avatar

    return `https://cdn.discordapp.com/icons/${data.id}/${data.icon}.webp?size=512`
}