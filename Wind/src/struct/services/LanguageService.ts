import BaseWatcher from "../base/BaseWatcher"
import { Locale } from "discord.js"
import { I18n } from "i18n"

interface ILocaleOptions { [ key: string]: string }

export default class LocaleService extends BaseWatcher {
    private readonly dir: string = `${__dirname}/../../../assets/locales`
    private readonly defaultLocale: Locale = Locale.EnglishUS
    public readonly i18n: I18n = new I18n()

    init() {
        this.i18n.configure({
            defaultLocale: this.defaultLocale,
            objectNotation: true,
            staticCatalog: {
                'ru': require(`${this.dir}/ru.json`),
                'en-US': require(`${this.dir}/en-US.json`)
            }
        })
    }

    get(path: string, locale: string, options: ILocaleOptions = {}): string {
        this.i18n.setLocale(locale)
        return this.i18n.__(path, options)
    }
}