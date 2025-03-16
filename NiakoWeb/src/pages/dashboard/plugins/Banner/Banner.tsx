import { Component, createRef } from 'react';
import styles from './Banner.module.scss'
import { TemplateSettings } from './TemplateSettings/TemplateSettings';
import { ImageSettings } from './ImageSettings/ImageSettings';
import { TextSettings } from './TextSettings/TextSettings';
import { MainSettings } from './MainSettings/MainSettings';
import { TabsContainer } from '../../../../components/TabsContainer/TabsContainer';
import { SaveButton } from '../../../../components/SaveButton/SaveButton';
import { Skeletone } from '../../../../components/Skeletone/Skeletone';
import { Focuslock } from '../../../../components/Focuslock/Focuslock';
import { apiUrl } from '../../../../config';

//import { ReactComponent as IconEditName } from '../../../../assets/svg/EditName.svg';
import { ReactComponent as IconWidgetStroke } from '../../../../assets/svg/WidgetStroke.svg';
import { ReactComponent as IconWidgetFill } from '../../../../assets/svg/WidgetFill.svg';
import { ReactComponent as IconPenStroke } from '../../../../assets/svg/PenStroke.svg';
import { ReactComponent as IconPenFill } from '../../../../assets/svg/PenFill.svg';
import { ReactComponent as IconAlbumStroke } from '../../../../assets/svg/AlbumStroke.svg';
import { ReactComponent as IconAlbumFill } from '../../../../assets/svg/AlbumFill.svg';
import { ReactComponent as IconBackupStroke } from '../../../../assets/svg/BackupStroke.svg';
import { ReactComponent as IconBackupFill } from '../../../../assets/svg/BackupFill.svg';
import { ReactComponent as IconCalendarStroke } from '../../../../assets/svg/Calendar.svg';
import { ReactComponent as IconCalendarFill } from '../../../../assets/svg/CalendarFill.svg';
import { TimeSettings } from './TimeSettings/TimeSettings';

export default class Banner extends Component<{ fonts: string[], currecyGuildId: string, setGuildState: (state: boolean) => any, sendError: Function }, { saveLoading: boolean, templatePage: string, focusLockImage: any, focusLockShowed: boolean, roles: any[], canSave: boolean | null, hasTier: boolean | null, boostCount: number, width: number, height: number, canvas: any, background: any, data: any, oldData: any, activeTab: string, fonts: string[], cursorX: number | null, cursorY: number | null, mouseX: number | null, mouseY: number | null, mouseI: number }> {
    state = {
        templatePage: 'ready',
        focusLockShowed: false,
        focusLockImage: null,
        saveLoading: false,
        hasTier: null,
        boostCount: 0,
        canSave: null as any,
        width: 0,
        height: 0,
        canvas: createRef(),
        background: null as any,
        roles: [],
        data: null as any,
        oldData: null as any,
        activeTab: (window.innerWidth > 540 ? 'Основное' : 'None'),
        mouseX: null,
        mouseY: null,
        cursorX: null,
        cursorY: null,
        mouseI: -1,
        fonts: this.props.fonts
    }

    render() {
        if(!this.state.hasTier && typeof this.state.hasTier !== 'object') {
            return (
                <div className={styles.content}>
                    <p className={styles.title}>Ой! Что-то не так...</p>
                    <div className={styles.description}>
                        <p className={styles.text}>Данная функция доступно со <a className={styles.bold} href="#/">2-ого</a> уровня <a rel="noreferrer" target='_blank' className={styles.link} href='https://support.discord.com/hc/en-us/articles/360028038352-Server-Boosting-FAQ-'>Discord Boost</a></p>
                    </div>
                </div>
            )
        }

        return (
            <div className={styles.plugin_wrapper} id='plugin_wrapper'>
                <Focuslock onClose={() => this.setState({ focusLockShowed: false })} image={this.state.focusLockImage} showed={this.state.focusLockShowed} uploadImage={(img: any) => this.setBackground(img)} />
                <SaveButton loading={this.state.saveLoading} show={this.state.canSave} onClick={this.save.bind(this)} />
                <div className={styles.preview}>
                    {
                    !this.state.data ? <Skeletone className={styles.block} /> :
                    (
                        <div className={styles.block}>
                            <canvas
                            id='canvas' className={`${styles.canvas} ${styles.anticlick}`} ref={this.state.canvas as any}
                            width={this.state.width} height={this.state.height} onMouseDown={this.onMouseDown.bind(this)} onMouseMove={this.onMouseMove.bind(this)} onMouseUp={this.onMouseUp.bind(this)}
                            ></canvas>
                            <img className={`${styles.background} ${styles.anticlick}`} style={{ position: 'absolute', zIndex: '-1', filter: 'blur(60px)' }} src={this.state.background?.currentSrc || `${apiUrl}/banner/BackgroundDefault.jpg`} alt='Background' loading="lazy"></img>
                            <img className={`${styles.background} ${styles.anticlick}`} src={this.state.background?.currentSrc || `${apiUrl}/banner/BackgroundDefault.jpg`} alt='Background' loading="lazy"></img>
                        </div>
                    )
                    }
                    {
                        !this.state.data ? <Skeletone type='tabs'/> :
                        <TabsContainer activeTab={this.state.activeTab} onClick={this.setActiveTab.bind(this)}
                        options={[
                            { label: 'Основное', strokeIcon: IconWidgetStroke, fillIcon: IconWidgetFill },
                            { label: 'Текст', strokeIcon: IconPenStroke, fillIcon: IconPenFill },
                            { label: 'Изображения', strokeIcon: IconAlbumStroke, fillIcon: IconAlbumFill },
                            { label: 'Время', strokeIcon: IconCalendarStroke, fillIcon: IconCalendarFill },
                            { label: 'Шаблоны', strokeIcon: IconBackupStroke, fillIcon: IconBackupFill }
                        ]}
                        />
                    }
                </div>
                { this.switcher() }
            </div>
        )
    }

    async save() {
        this.setState({ saveLoading: true })

        const user = JSON.parse(localStorage.getItem('niako') || '{}')?.currentUser
        if(!user) return this.locationToOrigin()

        const body = {
            ...this.state.data,
            items: this.state.data.items.map((i: any) => {
                let item = { ...i, image: null, canvas: null }
                delete item.image;
                delete item.canvas;
                return item;
            })
        }

        const response = await fetch(`${apiUrl}/private/guilds/${this.props.currecyGuildId}/banner`, {
            method: 'Put',
            headers: {
                'Authorization': user.token,
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(body)
        }).then(async (res) => await res.json()).catch(() => ({ status: false }))

        this.setState({
            canSave: !response.status,
            data: body,
            oldData: structuredClone(body),
            saveLoading: false
        })

        return this.updateImages(body, user)
    }

    switcher() {
        if(!this.state.data) {
            return (<Skeletone type='settings' />)
        }
        
        switch(this.state.activeTab) {
            case 'Текст':
                return <TextSettings className={styles.settings_wraper} roles={this.state.roles} data={this.state.data} boostCount={this.state.boostCount} sendError={this.props.sendError} fonts={this.state.fonts} updateBannerState={this.updateBannerState.bind(this)} resolveText={this.resolveText.bind(this)} createKey={this.createKey.bind(this)}/>
            case 'Изображения':
                return <ImageSettings className={styles.settings_wraper} data={this.state.data} boostCount={this.state.boostCount} sendError={this.props.sendError} fonts={this.state.fonts} updateBannerState={this.updateBannerState.bind(this)} resolveImage={this.resolveImage.bind(this)} createKey={this.createKey.bind(this)} loadImage={this.loadImage.bind(this)}/>
            case 'Шаблоны':
                return <TemplateSettings className={styles.settings_wraper} setUpdateTemplateTab={this.setUpdateTemplateTab.bind(this)} tabValue={this.state.templatePage} data={this.state.data} sendError={this.props.sendError} boostCount={this.state.boostCount} loadImage={this.loadImage.bind(this)} itemsResize={this.itemsResize.bind(this)} updateImages={this.updateImages.bind(this)} updateBannerState={this.updateBannerState.bind(this)}/>
            case 'Время':
                return <TimeSettings className={styles.settings_wraper} data={this.state.data} boostCount={this.state.boostCount} sendError={this.props.sendError} fonts={this.state.fonts} updateBannerState={this.updateBannerState.bind(this)} resolveImage={this.resolveImage.bind(this)} createKey={this.createKey.bind(this)} loadImage={this.loadImage.bind(this)}/>
            default:
                return <MainSettings className={styles.settings_wraper} setBackground={this.setBackground} focusLock={this.focusLock.bind(this)} data={this.state.data} sendError={this.props.sendError} boostCount={this.state.boostCount} currecyGuildId={this.props.currecyGuildId} itemsResize={this.itemsResize} updateBannerState={this.updateBannerState.bind(this)} loadImage={this.loadImage.bind(this)}/>
        }
    }

    async componentDidMount() {
        this.props.setGuildState(false)

        this.setState({
            data: null,
            oldData: null,
            canSave: null,
            hasTier: null,
            background: null,
            activeTab: (window.innerWidth > 540 ? 'Основное' : 'None')
        })

        const user = JSON.parse(localStorage.getItem('niako') || '{}')?.currentUser
        if(!user) return this.locationToOrigin()

        const discordInfo = await fetch(`${apiUrl}/private/guilds/${this.props.currecyGuildId}/info`, {
            headers: { 'Authorization': user.token }
        }).then(async (res) => await res.json()).catch(() => ({ status: false }))

        const premiumTier = Number(discordInfo?.answer?.premium_tier)

        if(!discordInfo?.status || isNaN(premiumTier) || 2 > premiumTier) {
            this.props.setGuildState(true)
            return this.setState({ hasTier: false, data: { guildId: this.props.currecyGuildId } })
        } else {
            const boosts = await fetch(`${apiUrl}/private/guilds/${this.props.currecyGuildId}/premium`)
            .then(async (res) => await res.json()).catch(() => ({ status: false }))
        
            const response = await fetch(`${apiUrl}/private/guilds/${this.props.currecyGuildId}/banner`, {
                headers: { 'Authorization': user.token }
            }).then(async (res) => await res.json()).catch(() => ({ status: false, message: 'error' }))
    
            if(!response.status) return this.locationToOrigin(response.message === 'Invalid auth token')
        
            const data = response.answer
    
            this.setState({
                hasTier: true,
                width: data.type === 'Normal' ? 960 : 540,
                height: data.type === 'Normal' ? 540 : 300,
                boostCount: (boosts?.status ? boosts.answer.count : 0),
                roles: discordInfo.answer.roles,
                oldData: structuredClone(data),
                data
            })
        
            let background = data.background
            let src = ''
            if(background.startsWith('canvas')) {
                src = `${apiUrl}/banner/${background.split('.')[1]}.png`
            } else if(background === 'Default') {
                src = `${apiUrl}/banner/BackgroundDefault.jpg`
            } else {
                src = background
            }
    
            await this.loadImage(src, true)

            this.props.setGuildState(true)
            
            await this.updateImages(data, user)
    
            return
        }
    }

    componentDidUpdate() {
        if(this.state.data && this.props.currecyGuildId !== this.state.data.guildId) {
            return this.componentDidMount()
        }

        return this.updateBanner()
    }

    setActiveTab(tab: string) {
        return this.setState({ activeTab: tab })
    }

    async updateImages(data: any, user?: any) {
        for(let i = 0; i < data.items.length; i++) {
            let item = data.items[i]
            if(item.type === 'Image') {
                if(item.url)
                    item.image = await this.loadImage(item.url.startsWith('canvas') ? `${apiUrl}/banner/${item.url.split('.')[1]}.png` : item.url)
            } else if(item.type === 'ActiveMemberAvatar') {
                if(user && user?.avatar) {
                    item.image = await this.loadImage(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=1024`)
                } else {
                    item.image = await this.loadImage(`${window.location.origin}/img/DefaultAvatar.png`)
                }
            }
        }

        this.setState({ focusLockShowed: false })

        return data.items
    }

    focusLock(e: any) {
        const file = e.target.files[0]
        if(!file || file.size > 1024 * 1024 * 4) return
        
        this.setState({ focusLockImage: file, focusLockShowed: true })
    }

    async setBackground(image: any) {
        if(!image) return

        if(image.size > 1024 * 1024 * 4) {
            return this.props.sendError('Размер файла привышает 4МБ')
        }

        let formData = new FormData()
        formData.append('file', image)

        const response = await fetch(`${apiUrl}/public/images/upload`, {
            method: 'Post',
            headers: {
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem('react')!)?.currentUser?.token}`
            },
            body: formData
        }).then(async (res) => await res.json())
        .catch(() => ({ status: false }))

        if(!response?.status) {
            return this.props.sendError(response?.message || 'Слишком большой размер файла')
        }

        await this.loadImage(response.answer, true)

        return this.setState({
            canSave: true,
            data: {
                ...this.state.data,
                background: response.answer
            }
        })
    }

    loadImage(imageURL: string, background: boolean = false, canSave: boolean = false) {
        return new Promise((resolve, reject) => {
            const image = new Image()
            image.onload = () => {
                if(background) {
                    this.setState({
                        canSave: canSave,
                        background: image,
                        data: {
                            ...this.state.data,
                            background: imageURL
                        }
                    })
                }

                resolve(image)
            }
            image.onerror = () => {
                this.props.sendError('Неизвестная ссылка на фон баннера')
            }
            image.src = imageURL
        })
    }

    updateBannerState(state: any) {
        if(state.hasOwnProperty('data')) {
            if(this.state.data && this.state.oldData) {
                const newData = {
                    ...state.data,
                    items: state.data.items.map((i: any) => {
                        let item = { ...i, image: null }
                        delete item.image;
                        return item;
                    })
                }

                state.canSave = JSON.stringify(newData) !== JSON.stringify(this.state.oldData)
            }
        }

        return this.setState({ ...state })
    }

    updateBanner() {
        const canvas = this.state.canvas.current as any
        if(!canvas || !this.state.data) return

        const rect = canvas.getBoundingClientRect()

        const ctx = canvas.getContext('2d')

        canvas.width = this.state.width
        canvas.height = this.state.height

        let x = 0
        let y = 0
        if(this.state.cursorX) {
            x = Math.round((this.state.cursorX - rect.left) * (this.state.width / rect.width))
        }
        if(this.state.cursorY) {
            y = Math.round((this.state.cursorY - rect.top) * (this.state.height / rect.height))
        }

        this.state.data.items.forEach((i: any, index: number) => {
            if(i.disabled) return

            if(i.type === 'Text') {
                ctx.textAlign = i.align
                ctx.fillStyle = i.color
                ctx.textBaseline = i.baseline
                ctx.font = `${i.size}px ${i.font}`

                if(i.angle !== 0) {
                    ctx.save()
                    ctx.translate(i.x, i.y)
                    ctx.rotate(Math.PI * 2 / 360 * i.angle);
                    ctx.translate(-i.x, -i.y)
                }

                const width = (!i?.width || i.width === 'None' ? canvas.width : i.width)

                const metrics = ctx.measureText(this.fillTextWidth(ctx, this.resolveText(i.text).default, width))

                i.canvas = {}
                i.canvas.width = metrics.width
                i.canvas.height = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent
                i.canvas.actual = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
        
                const widthX = Math.round(i.canvas.width*(rect.width / this.state.width))
                const heightY = Math.round(i.canvas.height*(rect.height / this.state.height))
                const isX = this.boolWidth(i, widthX, x)
                const isY = this.boolHeight(i, heightY, y)

                if(isX && isY) {
                    ctx.save()
                    ctx.strokeStyle = '#0A84ff';
                    ctx.lineWidth = 2
                    ctx.moveTo(this.getWidth(i.align, i.x, i.canvas.width), this.getHeight(i.baseline, i.y, i.canvas.actual)+i.canvas.actual);
                    ctx.lineTo(this.getWidth(i.align, i.x, i.canvas.width)+i.canvas.width, this.getHeight(i.baseline, i.y, i.canvas.actual)+i.canvas.actual);
                    ctx.stroke()
                    ctx.restore()
                }

                if(index === this.state.mouseI) {
                    ctx.save()
                    ctx.strokeStyle = '#0A84ff';
                    ctx.lineWidth = 2
                    ctx.strokeRect(
                        this.getWidth(i.align, i.x, i.canvas.width),
                        this.getHeight(i.baseline, i.y, i.canvas.height),
                        i.canvas.width, i.canvas.height
                    )
                    ctx.stroke()
                    ctx.restore()
                }

                let resolveText = this.resolveText(i.text).default
                if(i.isRazbit && !isNaN(parseInt(resolveText))) {
                    resolveText = this.razbitNumber(parseInt(resolveText))
                }

                ctx.fillText(this.fillTextWidth(ctx, resolveText, width), i.x, i.y, width)

                if(i.angle !== 0) {
                    ctx.restore()
                }
            } else if(['ActiveMemberAvatar', 'Image'].includes(i.type)) {
                if(i.image) {
                    const widthX = Math.round(i.width*(rect.width / this.state.width))
                    const heightY = Math.round(i.height*(rect.height / this.state.height))
                    const isX = this.boolWidth(i, widthX, x)
                    const isY = this.boolHeight(i, heightY, y)
    
                    if(isX && isY) {
                        ctx.save()
                        ctx.strokeStyle = '#0A84ff';
                        ctx.lineWidth = 1
                        ctx.strokeRect(i.x, i.y, i.width, i.height)
                        ctx.stroke()
                        ctx.restore()
                    }

                    if(index === this.state.mouseI) {
                        ctx.save()
                        ctx.strokeStyle = '#0A84ff';
                        ctx.lineWidth = 2
                        ctx.strokeRect(i.x, i.y, i.width, i.height)
                        ctx.stroke()
                        ctx.restore()
                    }

                    ctx.save()
                    ctx.beginPath()
                    if(i.shape) {
                        ctx.arc(i.x+(i.width/2), i.y+(i.height/2), i.width/2+(i.radius ? (i.width/4)/100*(100-i.radius) : 0), 0, Math.PI*2)
                        ctx.clip()
                    }
                    ctx.drawImage(i.image, i.x, i.y, i.width, i.height)
                    ctx.closePath()
                    ctx.restore()
                }
            }
        })
    }

    itemsResize(items: any[], normal = false) {
        return items.map((i) => {
            if(i.type === 'Image' || i.type === 'ActiveMemberAvatar') {
                i.height = Math.round(normal ? i.height*1.778 : i.height*0.5625)
            }
    
            if(i.type === 'Text') {
                i.size = Math.round(normal ? i.size*1.778 : i.size*0.5625)
            }
    
            if(typeof i.width === 'number') {
                i.width = Math.round(normal ? i.width*1.778 : i.width*0.5625)
            }
    
            return {
                ...i,
                x: Math.round(normal ? i.x*1.778 : i.x*0.5625),
                y: Math.round(normal ? i.y*1.778 : i.y*0.5625)
            }
        })
    }

    
    fillTextWidth(ctx: CanvasRenderingContext2D, text: string, width: number) {        
        const strs = text.split('')
        let txt = ''
        
        for ( let i = 0; strs.length > i; i++ ) {
            if(width >= ctx.measureText(txt + strs[i]).width) {
                txt += strs[i]
            } else {
                if(txt.length >= 3) {
                    return text.substring(0, txt.length-3) + '...'
                } else {
                    return text
                }
            }
        }

        return txt
    }

    createKey(item: any) {
        return `${item.type}.${item.textType ? `${item.textType}.` : ''}.${item.createdTimestamp}`
    }

    resolveImage(type: string) {
        switch(type) {
            case 'Image':
                return 'Изображение'
            case 'ActiveMemberAvatar':
                return 'Аватар активного'
            default:
                return 'Это че?'
        }
    }

    resolveText(type: string) {
        const user = JSON.parse(localStorage.getItem('niako') || '{}')?.currentUser
        switch(type) {
            case 'UserCount':
                return { default: '4678', name: 'Кол-во пользователей' }
            case 'BotCount':
                return { default: '12', name: 'Кол-во ботов' }
            case 'MemberCount':
                return { default: '3456', name: 'Кол-во участников' }
            case 'VoiceOnline':
                return { default: '999', name: 'Голосовой онлайн' }
            case 'Time':
                return { default: this.getDate(), name: 'Время' }
            case 'BoostCount':
                return { default: '14', name: 'Кол-во бустов' }
            case 'BoostTier':
                return { default: '3', name: 'Уровень буста' }
            case 'ActiveMemberUsername':
                return { default: (user?.username || 'unknown'), name: 'Юзернейм активного' }
            case 'ActiveMemberNickname':
                return { default: (user?.global_name || user?.username || 'unknown'), name: 'Отображаемое имя активного' }
            case 'ActiveMemberStatus':
                return { default: this.state.data.activeUserStatus, name: 'Статус активного' }
            case 'Default':
                return { default: String(type), name: 'Кастомный текст' }
            case 'RoleMembers':
                return { default: '32', name: 'Кол-во участников с ролью' }
            default:
                return { default: String(type), name: 'Это че?' }
        }
    }

    onMouseDown(e: any) {
        if(!this.state.canvas.current || !(this.state.canvas.current as any).contains(e.target)) {
            return
        }

        const canvas = (this.state.canvas!.current as any).getBoundingClientRect()

        let cursorX = e.clientX
        let cursorY = e.clientY

        const x = Math.round((cursorX - canvas.left) * (this.state.width / canvas.width))
        const y = Math.round((cursorY - canvas.top) * (this.state.height / canvas.height))

        const mouseI = this.state.data.items.findIndex((i: any) => {
            if(i.disabled) return false

            if(i.type === 'Text') {
                const width = Math.round(i.canvas.width*(canvas.width / this.state.width))
                const height = Math.round(i.canvas.height*(canvas.height / this.state.height))
        
                const isX = this.boolWidth(i, width, x)
                const isY = this.boolHeight(i, height, y)
                return isX && isY
            } else {
                const width = Math.round(i.width*(canvas.width / this.state.width))
                const height = Math.round(i.height*(canvas.height / this.state.height))
        
                const isX = this.boolWidth(i, width, x)
                const isY = this.boolHeight(i, height, y)
                return isX && isY
            }
        })

        if(mouseI !== -1) {
            cursorX = Math.round(x - this.state.data.items[mouseI].x)
            cursorY = Math.round(y - this.state.data.items[mouseI].y)
        }

        return this.setState({ mouseI, cursorX, cursorY })
    }

    onMouseMove(e: any) {
        if(this.state.mouseI === -1 || !this.state.canvas.current || !(this.state.canvas.current as any).contains(e.target)) {
            return this.setState({ cursorX: e.clientX, cursorY: e.clientY })
        }

        const item = this.state.data.items[this.state.mouseI]
        if(!item) return

        const canvas = (this.state.canvas!.current as any).getBoundingClientRect()
        const x = Math.round((e.clientX - canvas.left) * (this.state.width / canvas.width))-this.state.cursorX!
        const y = Math.round((e.clientY - canvas.top) * (this.state.height / canvas.height))-this.state.cursorY!

        const inputX = document.getElementById(`text-x-${this.createKey(item)}`) as any
        const inputY = document.getElementById(`text-y-${this.createKey(item)}`) as any

        item.x = x > this.state.width ? this.state.width : x
        item.y = y > this.state.height ? this.state.height : y

        if(inputX) inputX.value = item.x
        if(inputY) inputY.value = item.y

        return this.updateBannerState({
            canSave: true,
            data: {
                ...this.state.data,
                items: this.state.data.items
            }
        })

    }

    onMouseUp() {
        return this.setState({ mouseI: -1, mouseX: null, mouseY: null })
    }

    setUpdateTemplateTab(value: string) {
        return this.setState({ templatePage: value })
    }

    getDate() {
        const date = new Date()
        return `${this.formatNumber(date.getHours())}:${this.formatNumber(date.getMinutes())}`
    }

    private formatNumber(num: number) {
        if(10 > num) {
            return '0' + num
        } else {
            return String(num)
        }
    }

    private getWidth(align: string, x: number, width: number) {
        switch(align) {
            case 'center':
                return x-(width/2)
            case 'right':
                return x-width
            default:
                return x
        }
    }

    private getHeight(baseline: string, y: number, height: number) {
        switch(baseline) {
            case 'middle':
                return y-(height/2)
            case 'bottom':
                return y-height
            default:
                return y
        }
    }

    private boolWidth(el: { align: string, x: number, canvas: { width: number } }, width: number, px: number) {
        switch(el.align) {
            case 'center':
                return px > el.x-(width/2) && el.x+(width/2) > px
            case 'right':
                return px > el.x-(width) && el.x > px
            default:
                return px > el.x && el.x + width > px
        }
    }

    private boolHeight(el: { baseline: string, y: number, canvas: { height: number } }, height: number, py: number) {
        switch(el.baseline) {
            case 'middle':
                return py > el.y-(height/2) && el.y+(height/2) > py
            case 'bottom':
                return el.y > py && py > el.y-height
            default:
                return py > el.y && el.y+height > py
        }
    }

    private razbitNumber(num: number) {
        return String(num).split('').reverse().map((v,i) => { if((i+1) % 3 === 0 && num.toString().length-1 !== i) { return ` ${v}` } else { return v }}).reverse().join('')
    }

    private locationToOrigin(updateUser: boolean = false) {
        if(updateUser) {
            const item = localStorage.getItem('niako')
            if(item) {
                const json = JSON.parse(item)
                json.currentUser = null
                localStorage.setItem('niako', JSON.stringify(json))
            }
        }

        return window.location.href = window.location.origin
    }
}