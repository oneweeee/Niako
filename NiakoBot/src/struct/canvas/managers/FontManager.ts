import CanvasClient from "../CanvasClient";
import { Collection } from "discord.js";
import { registerFont } from "canvas";
import { readdir } from "fs";

export default class FontManager {
    private readonly dir: string = `${__dirname}/../../../../assets/fonts`
    private readonly cache: Collection<string, string> = new Collection()

    constructor(
        private canvas: CanvasClient
    ) {}

    init() {
        readdir(this.dir, (err, files) => {
            if(err) return this.canvas.client.logger.error(err)

            files.filter((f) => this.canvas.fontFormates.includes(f.split('.')[1]))
            .forEach((file) => {
                this.addFont(file)
            })
        })
    }

    array() {
        return this.cache.map((v) => v)
    }

    private async addFont(fileName: string) {
        const name = fileName.split('.')[0]
        const fullName = name.split('-').join(' ')
        if(this.cache.has(name)) {
            return this.canvas.client.logger.error(`Шрифт ${fullName} уже загружено`, 'CANVAS FONT')
        }

        if(name === 'Spaceland-en') {
            registerFont(`${this.dir}/${fileName}`, { family: name })
        } else {
            registerFont(`${this.dir}/${fileName}`, { family: fullName })
        }

        return this.cache.set(name, fullName)
    }
}