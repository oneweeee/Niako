import { Image, loadImage } from "canvas";
import { Collection } from "discord.js";
import { readdir } from "fs";
import CanvasClient from "../CanvasClient";

export default class ImageManager {
    private readonly dir: string = `${__dirname}/../../../../assets/images`
    private readonly cache: Collection<string, Image> = new Collection()
    
    constructor(
        private canvas: CanvasClient
    ) {}

    init() {
        readdir(this.dir, (err, files) => {
            if(err) return this.canvas.client.logger.error(err)

            files.filter((f) => this.canvas.imageFormates.includes(f.split('.')[1]))
            .forEach((file) => {
                this.addImage(file)
            })
        })
    }

    private async addImage(name: string) {
        if(this.cache.has(name.split('.')[0])) {
            return this.canvas.client.logger.error(`Изображение ${name.split('.')[0]} уже загружено`, 'CANVAS IMAGE')
        }

        return this.cache.set(name.split('.')[0], (await loadImage(`${this.dir}/${name}`)))
    }

    async get(name: string) {
        const img = this.cache.get(name)
        if(img) {
            return img
        } else {
            return (await loadImage(`${this.dir}/${name}`))
        }
    }
}