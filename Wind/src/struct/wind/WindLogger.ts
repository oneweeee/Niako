import WindClient from "#client"
import moment from "moment-timezone"
import chalk from "chalk"

export default class WindLogger {
    log(content: any) {
        console.log(
            this.getTime() + ' [' + chalk.yellow('Log') + ']: ' + content
        )
    }

    error(content: any, type?: string) {
        return console.log(
            this.getTime() + ' [' + chalk.green(type || 'Error') + ']: ' + content
        )
    }

    connect(content: any) {
        console.log(
            this.getTime() + ' [' + chalk.green('Connect') + ']: ' + content
        )
    }

    apiConnect(ip: string, port: number) {
        return this.connect(
            `Api succesfull build on http://${ip}:${port}/`
        )
    }

    wsConnect(ip: string, port: number) {
        return this.connect(
            `WebSocket succesfull build on ws://${ip}:${port}/`
        )
    }

    windConnect(client: WindClient) {
        return this.connect(
            `Bot ${client.user?.tag} succesfull build on cluster #${client.cluster.id+1}`
        )
    }

    databaseConnect() {
        return this.connect(
            `Service MongoDB`
        )
    }

    private getTime() {
        return `[${chalk.gray(moment(Date.now()).tz('Europe/Moscow').locale('ru-RU').format('YYYY.MM.DD | HH:mm:ss'))}]`
    }
}