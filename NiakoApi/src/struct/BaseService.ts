import * as config from "../config";

export default abstract class BaseService {
    public readonly config = config
    
    random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    randomElement<T>(array: T[]) {
        return array[this.random(0, array.length-1)]
    }

    generateImageLink(file: string, path: 'reaction' | 'banner') {
        return `${config.apiUrl}/${path}/${file}`
    }
}