import CanvasClient from "../CanvasClient";

export interface IStyleColors { text: string, status: string }
export interface IPackConfig { items: any[], styles: { background: string, active: boolean }[], status: string }
export interface IPackResolveConfig { background: string, activeUserUpdated: string, items: any[], status: string }

export default class PackManager {
    constructor(
        private canvas: CanvasClient
    ) {}

    getLite(styles: 'Pink' | 'Blue' | 'Red' | 'Purple' | 'Green' | 'Yellow'): IPackResolveConfig | null {
        const get = this.getLiteConfig(styles).styles.find((style) => style.background.endsWith(styles))
        if(!get) return null

        return {
            background: `canvasCache.LitePack_${styles}`,
            status: this.getLiteConfig(styles).status,
            items: this.getLiteConfig(styles).items,
            activeUserUpdated: '2h'
        }
    }

    getTechnologie(styles: 'Pink' | 'Blue' | 'Red' | 'Purple' | 'Green' | 'Yellow'): IPackResolveConfig | null {
        const get = this.getTechnologieConfig(styles).styles.find((style) => style.background.endsWith(styles))
        if(!get) return null

        return {
            background: `canvasCache.TechnologiePack_${styles}`,
            status: this.getTechnologieConfig(styles).status,
            items: this.getTechnologieConfig(styles).items,
            activeUserUpdated: '2h'
        }
    }

    getAvenue(styles: 'Pink' | 'Blue' | 'Red' | 'Purple' | 'Green' | 'Yellow'): IPackResolveConfig | null {
        const get = this.getAvenueConfig(styles).styles.find((style) => style.background.endsWith(styles))
        if(!get) return null

        return {
            background: `canvasCache.AvenuePack_${styles}`,
            status: this.getAvenueConfig(styles).status,
            items: this.getAvenueConfig(styles).items,
            activeUserUpdated: '2h'
        }
    }

    getSpace(styles: 'Pink' | 'Blue' | 'Red' | 'Purple' | 'Green' | 'Yellow'): IPackResolveConfig | null {
        const get = this.getSpaceConfig().styles.find((style) => style.background.endsWith(styles))
        if(!get) return null

        return {
            background: `canvasCache.SpacePack_${styles}`,
            status: this.getSpaceConfig().status,
            items: this.getSpaceConfig().items,
            activeUserUpdated: '2h'
        }
    }

    getStyles(pack: string) {
        switch(pack) {
            case 'LitePack':
                return ['Blue', 'Green', 'Pink', 'Purple', 'Red', 'Yellow']
            case 'TechnologiePack':
                return ['Blue', 'Green', 'Pink', 'Purple', 'Red', 'Yellow']
            case 'AvenuePack':
                return ['Blue', 'Green', 'Pink', 'Purple', 'Red', 'Yellow']
            case 'SpacePack':
                return ['Blue', 'Green', 'Pink', 'Purple', 'Red', 'Yellow']
            default:
                return []
        }
    }

    private getLiteConfig(styles: 'Pink' | 'Blue' | 'Red' | 'Purple' | 'Green' | 'Yellow'): IPackConfig {
        return {
            status: 'Статус не задан',
            items: [
                {
                    text: 'VoiceOnline',
                    disabled: false,
                    type: 'Text',
                    textType: 'VoiceOnline',
        
                    color: '#ffffff',
                    align: 'center',
                    baseline: 'middle',
                    style: 'regular',
                    length: 'None',
                    font: 'Montserrat SemiBold',
                    size: 32,
                    width: 'None',
                    timezone: 'None',
                    angle: 'None',
        
                    x: 822,
                    y: 446,
        
                    createdTimestamp: Date.now()
                },
                {
                    text: 'ActiveMemberNickname',
                    disabled: false,
                    type: 'Text',
                    textType: 'ActiveMemberNickname',
        
                    color: '#ffffff',
                    align: 'left',
                    baseline: 'top',
                    style: 'regular',
                    length: 'None',
                    font: 'Montserrat',
                    size: 48,
                    width: 412,
                    timezone: 'None',
                    angle: 'None',
        
                    x: 308,
                    y: 332.5,
        
                    createdTimestamp: Date.now()
                },
                {
                    text: 'ActiveMemberStatus',
                    disabled: false,
                    type: 'Text',
                    textType: 'ActiveMemberStatus',
        
                    color: '#96989D',
                    align: 'left',
                    baseline: 'top',
                    style: 'regular',
                    length: 'None',
                    font: 'Montserrat Medium',
                    size: 32,
                    width: 412,
                    timezone: 'None',
                    angle: 'None',
        
                    x: 308,
                    y: 391,
        
                    createdTimestamp: Date.now()
                },
                {
                    name: 'Active Member Avatar',
                    disabled: false,
                    type: 'ActiveMemberAvatar',
    
                    radius: 100,
                    width: 160,
                    height: 160,
                    shape: true,
                    url: '',
                    
                    x: 113.5,
                    y: 301.5,
    
                    createdTimestamp: Date.now()
                },
                {
                    name: 'Active Circle',
                    disabled: false,
                    type: 'Image',
    
                    radius: 0,
                    width: 169,
                    height: 169,
                    shape: false,
                    url: `canvasCache.LitePack_${styles}_Active`,
                    
                    x: 109,
                    y: 295,
    
                    createdTimestamp: Date.now()
                }
            ],
            styles: [
                { background: 'LitePack_Blue', active: true },
                { background: 'LitePack_Green', active: true },
                { background: 'LitePack_Pink', active: true },
                { background: 'LitePack_Purple', active: true },
                { background: 'LitePack_Red', active: true },
                { background: 'LitePack_Yellow', active: true }
            ]
        }
    }

    private getTechnologieColor(style: 'Pink' | 'Blue' | 'Red' | 'Purple' | 'Green' | 'Yellow'): IStyleColors {
        switch(style) {
            case 'Pink':
                return { text: '#FBAFFF', status: '#7B5E81' }
            case 'Blue':
                return { text: '#77AFFE', status: '#3F5D81' }
            case 'Red':
                return { text: '#FF3D87', status: '#752846' }
            case 'Purple':
                return { text: '#D784FD', status: '#67497F' }
            case 'Green':
                return { text: '#5AFA7E', status: '#317A4A' }
            case 'Yellow':
                return { text: '#FB8D1A', status: '#7A4F1A' }
        }
    }

    private getTechnologieConfig(styles: 'Pink' | 'Blue' | 'Red' | 'Purple' | 'Green' | 'Yellow'): IPackConfig {
        return {
            status: 'Статус не установлен',
            items: [
                {
                    text: 'VoiceOnline',
                    disabled: false,
                    type: 'Text',
                    textType: 'VoiceOnline',
        
                    color: this.getTechnologieColor(styles).text,
                    align: 'center',
                    baseline: 'middle',
                    style: 'regular',
                    length: 'None',
                    font: 'Geometria Medium',
                    size: 32,
                    width: 'None',
                    timezone: 'None',
                    angle: 'None',
        
                    x: 830,
                    y: 448,
        
                    createdTimestamp: Date.now()
                },
                {
                    text: 'MemberCount',
                    disabled: false,
                    type: 'Text',
                    textType: 'MemberCount',
        
                    color: this.getTechnologieColor(styles).text,
                    align: 'left',
                    baseline: 'middle',
                    style: 'regular',
                    length: 'None',
                    font: 'Geometria Medium',
                    size: 24,
                    width: 120,
                    timezone: 'None',
                    angle: 'None',
        
                    x: 568.5,
                    y: 302,
        
                    createdTimestamp: Date.now()
                },
                {
                    text: 'ActiveMemberNickname',
                    disabled: false,
                    type: 'Text',
                    textType: 'ActiveMemberNickname',
        
                    color: this.getTechnologieColor(styles).text,
                    align: 'left',
                    baseline: 'top',
                    style: 'regular',
                    length: 'None',
                    font: 'Geometria',
                    size: 48,
                    width: 400,
                    timezone: 'None',
                    angle: 'None',
        
                    x: 310,
                    y: 331,
        
                    createdTimestamp: Date.now()
                },
                {
                    text: 'ActiveMemberStatus',
                    disabled: false,
                    type: 'Text',
                    textType: 'ActiveMemberStatus',
        
                    color: this.getTechnologieColor(styles).status,
                    align: 'left',
                    baseline: 'top',
                    style: 'regular',
                    length: 'None',
                    font: 'Geometria Medium',
                    size: 24,
                    width: 400,
                    timezone: 'None',
                    angle: 'None',
        
                    x: 310,
                    y: 391.5,
        
                    createdTimestamp: Date.now()
                },
                {
                    name: 'Active Member Avatar',
                    disabled: false,
                    type: 'ActiveMemberAvatar',
    
                    radius: 100,
                    width: 140.5,
                    height: 140.5,
                    shape: true,
                    url: '',
                    
                    x: 111.5,
                    y: 307,
    
                    createdTimestamp: Date.now()
                }
            ],
            styles: [
                { background: 'TechnologiePack_Blue', active: true },
                { background: 'TechnologiePack_Green', active: true },
                { background: 'TechnologiePack_Pink', active: true },
                { background: 'TechnologiePack_Purple', active: true },
                { background: 'TechnologiePack_Red', active: true },
                { background: 'TechnologiePack_Yellow', active: true }
            ]
        }
    }


    private getAvenueConfig(styles: 'Pink' | 'Blue' | 'Red' | 'Purple' | 'Green' | 'Yellow'): IPackConfig {
        return {
            status: 'Статус не установлен',
            items: [
                {
                    text: 'VoiceOnline',
                    disabled: false,
                    type: 'Text',
                    textType: 'VoiceOnline',
        
                    color: '#FFFFFF',
                    align: 'center',
                    baseline: 'top',
                    style: 'regular',
                    length: 'None',
                    font: 'Gilroy Semibold',
                    size: 48,
                    width: 'None',
                    timezone: 'None',
                    angle: 'None',
        
                    x: 816.5,
                    y: 398,
        
                    createdTimestamp: Date.now()
                },
                {
                    text: 'ActiveMemberNickname',
                    disabled: false,
                    type: 'Text',
                    textType: 'ActiveMemberNickname',
        
                    color: '#FFFFFF',
                    align: 'left',
                    baseline: 'top',
                    style: 'regular',
                    length: 'None',
                    font: 'Gilroy',
                    size: 48,
                    width: 400,
                    timezone: 'None',
                    angle: 'None',
        
                    x: 291.5,
                    y: 327.5,
        
                    createdTimestamp: Date.now()
                },
                {
                    text: 'ActiveMemberStatus',
                    disabled: false,
                    type: 'Text',
                    textType: 'ActiveMemberStatus',
        
                    color: '#979797',
                    align: 'left',
                    baseline: 'top',
                    style: 'regular',
                    length: 'None',
                    font: 'Gilroy Semibold',
                    size: 30,
                    width: 400,
                    timezone: 'None',
                    angle: 'None',
        
                    x: 291.5,
                    y: 386.5,
        
                    createdTimestamp: Date.now()
                },
                {
                    name: 'Active Member Avatar',
                    disabled: false,
                    type: 'ActiveMemberAvatar',
    
                    radius: 100,
                    width: 149.76,
                    height: 149.76,
                    shape: true,
                    url: '',
                    
                    x: 106.76,
                    y: 297.88,
    
                    createdTimestamp: Date.now()
                },
                {
                    name: 'Active Circle',
                    disabled: false,
                    type: 'Image',
    
                    radius: 0,
                    width: 161.36,
                    height: 162.95,
                    shape: false,
                    url: `canvasCache.AvenuePack_${styles}_Active`,
                    
                    x: 100.96,
                    y: 290.5,
    
                    createdTimestamp: Date.now()
                }
            ],
            styles: [
                { background: 'AvenuePack_Blue', active: true },
                { background: 'AvenuePack_Green', active: true },
                { background: 'AvenuePack_Pink', active: true },
                { background: 'AvenuePack_Purple', active: true },
                { background: 'AvenuePack_Red', active: true },
                { background: 'AvenuePack_Yellow', active: true }
            ]
        }
    }

    private getSpaceConfig(): IPackConfig {
        return {
            status: 'Статус не установлен',
            items: [
                {
                    text: 'VoiceOnline',
                    disabled: false,
                    type: 'Text',
                    textType: 'VoiceOnline',
        
                    color: '#FFFFFF',
                    align: 'center',
                    baseline: 'top',
                    style: 'regular',
                    length: 'None',
                    font: 'Spaceland en',
                    size: 107,
                    width: 'None',
                    timezone: 'None',
                    angle: 'None',
        
                    x: 826,
                    y: 306.5,
        
                    createdTimestamp: Date.now()
                },
                {
                    text: 'ActiveMemberNickname',
                    disabled: false,
                    type: 'Text',
                    textType: 'ActiveMemberNickname',
        
                    color: '#FFFFFF',
                    align: 'center',
                    baseline: 'top',
                    style: 'regular',
                    length: 'None',
                    font: 'Spaceland en',
                    size: 40,
                    width: 200,
                    timezone: 'None',
                    angle: 'None',
        
                    x: 479,
                    y: 429,
        
                    createdTimestamp: Date.now()
                },
                {
                    name: 'Active Member Avatar',
                    disabled: false,
                    type: 'ActiveMemberAvatar',
    
                    radius: 100,
                    width: 259.5,
                    height: 259.5,
                    shape: true,
                    url: '',
                    
                    x: 350.45,
                    y: 125.65,
    
                    createdTimestamp: Date.now()
                },
                {
                    name: 'Active Line',
                    disabled: false,
                    type: 'Image',
    
                    radius: 0,
                    width: 960,
                    height: 540,
                    shape: false,
                    url: `canvasCache.SpacePack_Active`,
                    
                    x: 0,
                    y: 0,
    
                    createdTimestamp: Date.now()
                }
            ],
            styles: [
                { background: 'SpacePack_Blue', active: true },
                { background: 'SpacePack_Green', active: true },
                { background: 'SpacePack_Pink', active: true },
                { background: 'SpacePack_Purple', active: true },
                { background: 'SpacePack_Red', active: true },
                { background: 'SpacePack_Yellow', active: true }
            ]
        }
    }
}