import BaseListener from "../base/BaseListener"
import BaseWatcher from "../base/BaseWatcher"
import WindClient from "../WindClient"
import { readdir } from "fs"

export default class ListenerWatcher extends BaseWatcher {
    private readonly dir: string = `${__dirname}/../../app/Listeners`

    constructor(
        private client: WindClient
    ) { super() }

    load(dir: string = this.dir) {
        readdir(dir, async (err, files) => {
            if(err) return

            const dirs = files.filter((file) => this.isDirectory(dir, file))

            for ( let i = 0; files.length > i; i++ ) {
                this.load(`${dir}/${dirs[i]}`)
            }
            
            files = files.filter((file) => this.isFile(dir, file))

            for ( let i = 0; files.length > i; i++ ) {
                const listener = (await import(`${dir}/${files[i]}`))
                if(listener?.default && listener.default instanceof BaseListener) {
                    this.addListener(listener.default)
                } else {
                    this.client.logger.error(`Error loaded BaseListener file "${files[i]}"...`)
                }
            }
        })
    }

    addListener(file: BaseListener) {
        if(file.options?.disabled) return

        if(file.options?.once) {
            this.client.once(file.options.name, file.exec.bind(null, this.client))
        } else {
            this.client.on(file.options.name, file.exec.bind(null, this.client))
        }
    }
}