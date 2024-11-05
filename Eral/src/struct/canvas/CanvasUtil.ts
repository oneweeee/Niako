import { loadImage } from "canvas";
import Client from "../client/Client";

export default abstract class CanvasUtil {
    constructor(
        public client: Client
    ) {}

    public readonly imageFormates: string[] = [ 'png', 'jpg', 'gif' ]
    public readonly fontFormates: string[] = [ 'ttf', 'otf' ]

    public async loadImage(url: string) {
        try {
            if(url.startsWith('canvasCache')) {
                const name = url.split('.')[1]
                return (await this.client.canvas.images.get(name) || await this.client.canvas.images.get('BackgroundDefault'))
            } else {
                return (await loadImage(url))
            }
        } catch {
            return (await this.client.canvas.images.get('BackgroundDefault'))
        }
    }

    public async loadImageState(url: string) {
        try {
            await loadImage(url)
            return true
        } catch {
            return false
        }
    }
}