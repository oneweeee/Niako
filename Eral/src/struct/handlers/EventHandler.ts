import { Collection } from "discord.js";
import { readdir } from "fs";
import Client from "../client/Client";
import BaseEvent from "../base/BaseEvent";

export default class EventHandler {
    private readonly dir: string = `${__dirname}/../../app/Events`
    readonly cache: Collection<string, BaseEvent> = new Collection()

    constructor(
        private client: Client
    ) {}

    load() {
        readdir(this.dir, (err, dirs) => {
            if(err) return this.client.logger.error(err)

            dirs.filter(d => d.split('.').length === 1)
            .forEach((dir) => {
                readdir(`${this.dir}/${dir}`, (err, files) => {
                    if(err) return this.client.logger.error(err)
        
                    files.filter((f) => ['js', 'ts'].includes(f.split('.')[1]))
                    .forEach(async (file) => {
                        const event = (await import(`${this.dir}/${dir}/${file}`))
                        if(event?.default && event.default instanceof BaseEvent) {
                            return this.addListener(event.default)
                        } else {
                            return this.client.logger.error(`Error loaded Event file "${file}"...`)
                        }
                    })
                })
            })
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