const fs = require('fs')

function check(dir = './src') {
    const poo = fs.readdirSync(dir)

    const files = poo.filter((c) => Boolean(c.split('.')[1]) && !dir.endsWith('lib'))
    const dirs = poo.filter((c) => !Boolean(c.split('.')[1]))

    let count = 0
    for ( let i = 0; files.length > i; i++ ) {
        count += fs.readFileSync(`${dir}/${files[i]}`, 'utf-8').split('\n').length
    }

    for ( let i = 0; dirs.length > i; i++ ) {
        count += check(`${dir}/${dirs[i]}`)
    }

    return count
}

console.log(check())