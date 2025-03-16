import { ComponentType } from "react"
import { TTheme } from "./theme"

export type TDashboardPluginBadge = 'New' | 'Beta' | 'Premium'

export interface IDashboardPlugin {
    name: string,
    title: string,
    strokeIcon?: any,
    fillIcon?: any,
    badge?: TDashboardPluginBadge,
    component?: any,
    childrens?: IDashboardPlugin[]
}

export interface IDashboardOptions {
    user: any,
    loading: boolean,
    guilds: any[],
    openMenu: boolean,
    currecyGuildId: string,
    plugin: any,
    canSave: boolean,
    guildState: boolean,
    errors: string[],
    fonts: string[]
}

export interface IDashboardPluginOptions {
    user: any,
    guilds: any[],
    openMenu: boolean,
    plugin: any,
    guildState: boolean,
    currecyGuildId: string,
    setOpenMenu: (state: boolean) => any,
    setCurrencyGuild: (guildId: string) => any,
    setPlugin: (plugin: any) => any,
    setGuildState: (state: boolean) => any,
    fonts: string[]
}

export interface IDashboardDrawerMenuOptions {
    theme: TTheme,
    page: string,
    state: boolean,
    setOpenMenu: (state: boolean) => any
}

export interface IDrawerMenuOptions {
    plugins: IDashboardPlugin[],
    currecyPage: string
}