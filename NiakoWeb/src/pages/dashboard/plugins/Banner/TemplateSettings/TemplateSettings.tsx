import { Component } from "react";
//import { SwitcherButtons } from "../../../../../components/SwitcherButtons/SwitcherButtons";
import { ReadyContainer } from "./ReadyContainer/ReadyContainer";
import { FoneContainer } from "./FoneContainer/FoneContainer";
import styles from './TemplateSettings.module.scss'
import { apiUrl } from "../../../../../config";

export class TemplateSettings extends Component<{ setUpdateTemplateTab: any, tabValue: string, className: any, data: any, boostCount: number, itemsResize: Function, sendError: Function, loadImage: (img: any, bg?: boolean) => any, updateImages: (data: any, user?: any) => any, updateBannerState: (state: any) => any }, { templates: { name: string, colors: string[], fileName: string, premium: boolean, onlyReady?: boolean, items: any[] }[] }> {
    render() {
        return (
            <div className={`${styles.settings} ${this.props.className}`} id='settings'>
                { /* <SwitcherButtons currencyButton={this.props.tabValue} buttons={
                    [
                        { label: 'Готовые', value: 'ready' },
                        //{ label: 'Фоновое', value: 'fone' }
                    ]
                } onClick={this.props.setUpdateTemplateTab}/> */ }
                <div className={styles.cards}>
                {
                    this.props.tabValue === 'ready' ?
                    this.state.templates.map((t) => {
                        return (<ReadyContainer key={t.name} boostCount={this.props.boostCount} setReadyItems={this.setReadyItems.bind(this)} currecyGuildId={this.props.data.guildId} config={t} />)
                    }) :
                    this.state.templates.filter((t) => !t?.onlyReady).map((t) => {
                        return (<FoneContainer key={t.name} boostCount={this.props.boostCount} setFoneItems={this.setFoneItems.bind(this)} currecyGuildId={this.props.data.guildId} config={t} />)
                    })
                }
                </div>
            </div>
        )
    }

    async setReadyItems(config: any, color: string) {
        const url = `${apiUrl}/banner/${config.fileName}_${color}.png`

        let items = this.getConfigItems(config, color)

        const user = JSON.parse(localStorage.getItem('niako') || '{}')?.currentUser
        items = await this.props.updateImages({ items: items }, user)

        if(this.props.data.type === 'Compressed') {
            items = this.props.itemsResize(items)
        }

        return this.props.updateBannerState({
            canSave: true,
            background: (await this.props.loadImage(url)),
            data: {
                ...this.props.data,
                background: url,
                items: items
            }
        })
    }

    async setFoneItems(config: any, color: string) {
        let items = structuredClone(this.getConfigItems(config, color, true))

        const user = JSON.parse(localStorage.getItem('niako') || '{}')?.currentUser
        items = await this.props.updateImages({ items: items }, user)

        if(this.props.data.type === 'Compressed') {
            items = this.props.itemsResize(items)
        }

        return this.props.updateBannerState({
            canSave: true,
            data: {
                ...this.props.data,
                items: items
            }
        })
    }

    getConfigItems(config: any, style: string, fone: boolean = false) {
        const items = Object.assign(config.items)
        if(fone) {
            const get = items.findIndex((i: any) => i.name === 'Template')
            if(get >= 0) {
                items.splice(get, 1)
            }

            items.unshift(
                {
                    name: 'Template',
                    disabled: false,
                    type: 'Image',
    
                    radius: 0,
                    width: 960,
                    height: 540,
                    shape: false,
                    url: `canvasCache.${config.fileName}Template_COLOR.png`,
                    
                    x: 0,
                    y: 0,
    
                    createdTimestamp: Date.now()
                }
            )
        }

        return items.map((i: any) => {
            let obj = { ...i }
            if(obj?.url && obj.url.startsWith('canvasCache')) {
                obj.url = `${apiUrl}/banner/${obj.url.replace('COLOR', style).split('.')[1]}.png`
            }

            if(obj?.color && obj.color.startsWith('CUSTOM')) {
                const color = this.getTechnologieColor(style)
                obj.color = obj.color.replace(obj.color, obj.color.endsWith('TEXT') ? color.text : color.status)
            }

            return obj
        })
    }

    state = {
        templates: [
            {
                name: 'Lite',
                originColor: '#7B8DFF',
                colors: [ 'Original', 'White', 'Red', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink' ],
                fileName: 'LitePack',
                premium: false,
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
                        y: 298.5,
        
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
                        url: `canvasCache.LitePack_COLOR_Active`,
                        
                        x: 109,
                        y: 291,
        
                        createdTimestamp: Date.now()
                    }
                ]
            },
            {
                name: 'Avenue',
                originColor: '#E843FF',
                colors: [ 'Original', 'Red', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink' ],
                fileName: 'AvenuePack',
                premium: true,
                onlyReady: true,
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
                        url: `canvasCache.AvenuePack_COLOR_Active`,
                        
                        x: 100.96,
                        y: 290.5,
        
                        createdTimestamp: Date.now()
                    }
                ]
            },
            {
                name: 'Cyberpunk',
                originColor: '#97DAEE',
                colors: [ 'Original', 'White', 'Red', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink' ],
                fileName: 'TechnologiePack',
                premium: false,
                items: [
                    {
                        text: 'VoiceOnline',
                        disabled: false,
                        type: 'Text',
                        textType: 'VoiceOnline',
            
                        color: 'CUSTOM.TEXT',
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
            
                        color: 'CUSTOM.TEXT',
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
            
                        color: 'CUSTOM.TEXT',
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
            
                        color: 'CUSTOM.STATUS',
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
                ]
            },
            {
                name: 'Space',
                originColor: '#9487F4',
                colors: [ 'Original', 'Red', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink' ],
                fileName: 'SpacePack',
                premium: true,
                onlyReady: true,
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
                        y: 319.5,
            
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
                        y: 432,
            
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
                ]
            },
            {
                name: 'Sakura',
                originColor: '#F62F36',
                colors: [ 'Original', 'White', 'Red', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink' ],
                fileName: 'SakuraPack',
                premium: false,
                onlyReady: true,
                items: [
                    {
                        text: 'VoiceOnline',
                        disabled: false,
                        type: 'Text',
                        textType: 'VoiceOnline',
            
                        color: '#FFFFFF',
                        align: 'left',
                        baseline: 'top',
                        style: 'regular',
                        length: 'None',
                        font: 'Gilroy Medium',
                        size: 64,
                        width: 'None',
                        timezone: 'None',
                        angle: 'None',
            
                        x: 675.5,
                        y: 287,
            
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
                        width: 326,
                        timezone: 'None',
                        angle: 'None',
            
                        x: 288.5,
                        y: 342,
            
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
                        size: 24,
                        width: 326,
                        timezone: 'None',
                        angle: 'None',
            
                        x: 288.5,
                        y: 396,
            
                        createdTimestamp: Date.now()
                    },
                    {
                        name: 'Active Member Avatar',
                        disabled: false,
                        type: 'ActiveMemberAvatar',
        
                        radius: 100,
                        width: 145,
                        height: 145,
                        shape: true,
                        url: '',
                        
                        x: 112.5,
                        y: 311,
        
                        createdTimestamp: Date.now()
                    }
                ]
            },
            {
                name: 'Decide',
                originColor: '#FD5563',
                colors: [ 'Original', 'White' ],
                fileName: 'DecidePack',
                premium: false,
                onlyReady: true,
                items: [
                    {
                        text: 'VoiceOnline',
                        disabled: false,
                        type: 'Text',
                        textType: 'VoiceOnline',
            
                        color: '#FFFFFF',
                        align: 'right',
                        baseline: 'middle',
                        style: 'regular',
                        length: 'None',
                        font: 'Gilroy',
                        size: 100,
                        width: 'None',
                        timezone: 'None',
                        angle: 'None',
            
                        x: 231,
                        y: 274,
            
                        createdTimestamp: Date.now()
                    },
                    {
                        text: 'MemberCount',
                        disabled: false,
                        type: 'Text',
                        textType: 'MemberCount',
            
                        color: '#FFFFFF',
                        align: 'right',
                        baseline: 'middle',
                        style: 'regular',
                        length: 'None',
                        font: 'Gilroy',
                        size: 75,
                        width: 'None',
                        timezone: 'None',
                        angle: 'None',
            
                        x: 359,
                        y: 423,
            
                        createdTimestamp: Date.now()
                    },
                    {
                        text: 'за 2 часа',
                        disabled: false,
                        type: 'Text',
                        textType: 'Default',
            
                        color: '#FFFFFF',
                        align: 'center',
                        baseline: 'top',
                        style: 'regular',
                        length: 'None',
                        font: 'Geometria',
                        size: 64,
                        width: 'None',
                        timezone: 'None',
                        angle: 'None',
            
                        x: 720,
                        y: 412,
            
                        createdTimestamp: Date.now()
                    },
                    {
                        name: 'Active Member Avatar',
                        disabled: false,
                        type: 'ActiveMemberAvatar',
        
                        radius: 100,
                        width: 257,
                        height: 257,
                        shape: true,
                        url: '',
                        
                        x: 591,
                        y: 103,
        
                        createdTimestamp: Date.now()
                    }
                ]
            },
            {
                name: 'Heligate',
                originColor: '#7BF2C7',
                colors: [ 'Original', 'White', 'Red', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink' ],
                fileName: 'Heligate',
                premium: false,
                onlyReady: true,
                items: [
                    {
                        text: 'VoiceOnline',
                        disabled: false,
                        type: 'Text',
                        textType: 'VoiceOnline',
            
                        color: '#FFFFFF',
                        align: 'center',
                        baseline: 'middle',
                        style: 'regular',
                        length: 'None',
                        font: 'Gilroy SemiBold',
                        size: 38,
                        width: 'None',
                        timezone: 'None',
                        angle: 'None',
            
                        x: 830,
                        y: 422,
            
                        createdTimestamp: Date.now()
                    },
                    {
                        text: 'ServerName',
                        disabled: false,
                        type: 'Text',
                        textType: 'Default',
            
                        color: '#FFFFFF',
                        align: 'left',
                        baseline: 'middle',
                        style: 'regular',
                        length: 'None',
                        font: 'Gilroy',
                        size: 46.5,
                        width: 'None',
                        timezone: 'None',
                        angle: 'None',
            
                        x: 494,
                        y: 189,
            
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
                        width: 332,
                        timezone: 'None',
                        angle: 'None',
            
                        x: 280,
                        y: 310,
            
                        createdTimestamp: Date.now()
                    },
                    {
                        text: 'ActiveMemberStatus',
                        disabled: false,
                        type: 'Text',
                        textType: 'ActiveMemberStatus',
            
                        color: '#FFFFFF',
                        align: 'left',
                        baseline: 'top',
                        style: 'regular',
                        length: 'None',
                        font: 'Gilroy Semibold',
                        size: 28,
                        width: 332,
                        timezone: 'None',
                        angle: 'None',
            
                        x: 280,
                        y: 372,
            
                        createdTimestamp: Date.now()
                    },
                    {
                        name: 'Active Member Avatar',
                        disabled: false,
                        type: 'ActiveMemberAvatar',
        
                        radius: 100,
                        width: 157.4,
                        height: 157.4,
                        shape: true,
                        url: '',
                        
                        x: 87.36,
                        y: 277.32,
        
                        createdTimestamp: Date.now()
                    }
                ]
            },
            {
                name: 'Elysium',
                originColor: '#00AFFF',
                colors: [ 'Original', 'White', 'Red', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink' ],
                fileName: 'Elysium',
                premium: true,
                onlyReady: true,
                items: [
                    {
                        text: 'VoiceOnline',
                        disabled: false,
                        type: 'Text',
                        textType: 'VoiceOnline',
            
                        color: '#FFFFFF',
                        align: 'center',
                        baseline: 'middle',
                        style: 'regular',
                        length: 'None',
                        font: 'Montserrat SemiBold',
                        size: 32,
                        width: 'None',
                        timezone: 'None',
                        angle: 'None',
            
                        x: 824,
                        y: 475,
            
                        createdTimestamp: Date.now()
                    },
                    {
                        text: 'MemberCount',
                        disabled: false,
                        type: 'Text',
                        textType: 'MemberCount',
            
                        color: '#FFFFFF',
                        align: 'left',
                        baseline: 'middle',
                        style: 'regular',
                        length: 'None',
                        font: 'Montserrat',
                        size: 25,
                        width: 'None',
                        timezone: 'None',
                        angle: 'None',
            
                        x: 530,
                        y: 348,
            
                        createdTimestamp: Date.now()
                    },
                    {
                        text: 'Самый активный за 2 часа',
                        disabled: false,
                        type: 'Text',
                        textType: 'Default',
            
                        color: '#FFFFFF',
                        align: 'left',
                        baseline: 'top',
                        style: 'regular',
                        length: 'None',
                        font: 'Montserrat',
                        size: 45,
                        width: 'None',
                        timezone: 'None',
                        angle: 'None',
            
                        x: 65.5,
                        y: 229.5,
            
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
                        font: 'Montserrat',
                        size: 50,
                        width: 408,
                        timezone: 'None',
                        angle: 'None',
            
                        x: 298,
                        y: 364,
            
                        createdTimestamp: Date.now()
                    },
                    {
                        text: 'ActiveMemberStatus',
                        disabled: false,
                        type: 'Text',
                        textType: 'ActiveMemberStatus',
            
                        color: '#B0B0B0',
                        align: 'left',
                        baseline: 'top',
                        style: 'regular',
                        length: 'None',
                        font: 'Montserrat SemiBold',
                        size: 30,
                        width: 408,
                        timezone: 'None',
                        angle: 'None',
            
                        x: 298,
                        y: 424,
            
                        createdTimestamp: Date.now()
                    },
                    {
                        name: 'Active Member Avatar',
                        disabled: false,
                        type: 'ActiveMemberAvatar',
        
                        radius: 100,
                        width: 200,
                        height: 200,
                        shape: true,
                        url: '',
                        
                        x: 62,
                        y: 308,
        
                        createdTimestamp: Date.now()
                    },
                    {
                        name: 'Active Circle',
                        disabled: false,
                        type: 'Image',
        
                        radius: 0,
                        width: 66,
                        height: 66,
                        shape: false,
                        url: `canvasCache.Elysium_COLOR_Active`,
                        
                        x: 44,
                        y: 301,
        
                        createdTimestamp: Date.now()
                    }
                ]
            }
        ]
    }

    private getTechnologieColor(style: string) {
        switch(style) {
            case 'Original':
                return { text: '#97DAEE', status: '#486975' }
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
            default: {
                return { text: `#FFFFFF`, status: `#A2A19E`}
            }
        }
    }
}