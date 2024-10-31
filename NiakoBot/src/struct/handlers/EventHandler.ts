import { NiakoClient } from "../client/NiakoClient";
import BaseEvent from "../base/BaseEvent";
import { Collection } from "discord.js";
import { readdir } from "fs";

export default class EventHandler {
    private readonly dir: string = `${__dirname}/../../app/Events`
    readonly cache: Collection<string, BaseEvent> = new Collection()

    constructor(
        private client: NiakoClient
    ) {}

    async load() {
        readdir(this.dir, (err, dirs) => {
            if(err) return this.client.logger.error(err)

            dirs = dirs.filter(d => d.split('.').length === 1)
            for ( let i = 0; dirs.length > i; i++ ) {
                readdir(`${this.dir}/${dirs[i]}`, async (err, files) => {

                    files = files.filter((f) => ['js', 'ts'].includes(f.split('.')[1]))
                    for ( let j = 0; files.length > j; j++ ) {
                        const event = (await import(`${this.dir}/${dirs[i]}/${files[j]}`))
                        if(event?.default && event.default instanceof BaseEvent) {
                            this.addListener(event.default)
                        } else {
                            this.client.logger.error(`Error loaded Event file "${files[j]}"...`)
                        }
                    }
                })
            }
        })
    }

    addListener(file: BaseEvent) {
        if(this.cache.has(file.options.name)) {
            return this.client.logger.error(`Event ${file.options.name} is loaded!`)
        }

        if(file.options.disabled) return

        if(file.options.once) {
            this.client.once(file.options.name, file.run.bind(null, this.client))
        } else {
            this.client.on(file.options.name, file.run.bind(null, this.client))
        }
    }

    removeListener(name: string) {
        if(!this.cache.has(name)) {
            return this.client.logger.error(`Event ${name} is not loaded!`)
        }

        this.client.on(name, () => {})
    }
}