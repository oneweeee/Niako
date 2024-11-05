import { lstatSync } from "fs"

export default abstract class BaseWatcher {
    private readonly languages: string[] = [ 'js', 'ts' ]
    private readonly ignoreDirs: string[] = [ 'Collectors', 'Sub' ]

    isFile(put: string, file: string) {
        return lstatSync(`${put}/${file}`).isFile() && this.languages.includes(file.split('.')[1])
    }

    isDirectory(put: string, dir: string) {
        return lstatSync(`${put}/${dir}`).isDirectory() && !dir.split('.')[1] && !this.ignoreDirs.includes(dir)
    }
}