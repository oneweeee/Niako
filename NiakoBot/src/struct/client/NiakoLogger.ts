import moment from "moment-timezone";
import {
    cyan,
    yellow,
    blue,
    green,
    red
} from "colors";

export default class NiakoLogger {
    log(text: string) {
        console.log(this.format() + yellow('[LOG] ') + text)
    }

    info(text: string) {
        console.log(this.format() + blue('[INFO] ') + text)
    }

    success(text: string) {
        console.log(this.format() + green('[SUCCESS] ') + text)
    }

    error(err: Error | string, type: string = 'ERROR') {
        if(typeof err === 'string') {
            return console.log(this.format() + red(`[${type}] `) + err)
        } else {
            return console.log(this.format() + red(`[${type}] `) + `${err.name}: ${err.message}\n${err.stack}`)
        }
    }

    private format() {
        const time = moment(Date.now()).tz('Europe/Moscow').locale('ru-RU')
        return cyan(`[${time.format('DD.MM.YYYY')} | ${time.format('HH:mm:ss')}] `)
    }
}