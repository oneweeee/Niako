import { Component } from 'react';
import styles from './Room.module.scss'
import { DiscordMessage } from '../../../../components/DiscordMessage/DiscordMessage';
import { TabsContainer } from '../../../../components/TabsContainer/TabsContainer';
import { SaveButton } from '../../../../components/SaveButton/SaveButton';
import { Skeletone } from '../../../../components/Skeletone/Skeletone';
import { Button } from '../../../../components/Button/Button';

import { ReactComponent as IconWidgetStroke } from '../../../../assets/svg/WidgetStroke.svg';
import { ReactComponent as IconWidgetFill } from '../../../../assets/svg/WidgetFill.svg';
import { ReactComponent as IconTextBStroke } from '../../../../assets/svg/TextBStroke.svg';
import { ReactComponent as IconTextBFill } from '../../../../assets/svg/TextBFill.svg';
import { ReactComponent as IconChatStroke } from '../../../../assets/svg/ChatStroke.svg';
import { ReactComponent as IconChatFill } from '../../../../assets/svg/ChatFill.svg';
import { ReactComponent as IconChatLine } from '../../../../assets/svg/ChatLine.svg';
import { ReactComponent as IconAddCircle } from '../../../../assets/svg/AddCircleStroke.svg';
import { MessageSettings } from './MessageSettings/MessageSettings';
import { ButtonSettings } from './ButtonSettings/ButtonSettings';
import { MainSettings } from './MainSettings/MainSettings';
import { apiUrl } from '../../../../config';

export default class Room extends Component<{ currecyGuildId: string, setGuildState: (v: boolean) => any, sendError: any }, { touchEnd: number, styles: any, bgProc: any, mouseMove: boolean, width: number, showMessage: boolean, messageLoading: boolean, saveLoading: boolean, createVoice: boolean, activeTab: string, data: any, oldData: any, discord: any, buttons: any, canSave: boolean | null }> {
    state = {
        width: window.innerWidth, showMessage: false, mouseMove: false, styles: '0px', bgProc: 0, touchEnd: 0,
        messageLoading: false,
        saveLoading: false,
        createVoice: false,
        activeTab: 'Основные',
        data: null as any,
        oldData: null as any,
        discord: null as any,
        canSave: null as any,
        buttons: null as any
    }

    render() {
        if(!this.state?.data) {
            return (
                <div className={styles.plugin_wrapper} id='plugin_wrapper'>
                    { this.state.width > 720 && <Skeletone type='discord_message' /> }
                    <div id='room_settings' className={`${styles.settings} ${styles.skeleton}`}>
                        <Skeletone type='tabs' />
                        <Skeletone type='settings' />
                    </div>
                </div>
            )
        }

        if(!this.state.data.state) {
            return (
                <div className={styles.content}>
                    <p className={styles.title}>Ой! Что-то не так...</p>
                    <div className={styles.description}>
                        <p className={styles.text}>У Вас ещё не установлена система приватных комнат!</p>
                        <Button type='Fill' icon={IconAddCircle} color='Primary' loading={this.state.createVoice} alignSelf='stretch' content='Создать приватные комнаты' onClick={this.create.bind(this)} />
                    </div>
                </div>
            )
        }

        const components = this.resolveComponents()

        return (
            <div className={styles.plugin_wrapper} id='plugin_wrapper'>
                <SaveButton show={this.state.canSave} loading={this.state.saveLoading} onClick={this.save.bind(this)} />
                <div className={styles.discord}>
                    <DiscordMessage width={this.state.width} updateButtons={this.updateButtons.bind(this)} loading={this.state.messageLoading} className={styles.message} data={`{ "embeds": [ ${this.replaceEmojiValue(this.state.data.embed)} ], "components": ${JSON.stringify(components)} }`} webhook={this.state.data.webhook} />
                </div>
                {
                    this.state.width > 720 ? '' : (
                        <div className={styles.mobile}>
                            {
                                this.state.showMessage ? '' : (
                                    <div className={styles.button} onClick={this.onShowMessage.bind(this)}>
                                        <IconChatLine className={styles.icon} />
                                    </div>
                                )
                            }
                            {
                                !this.state.showMessage ? '' : (
                                    <div className={styles.message} onTouchMove={this.onMouseMove.bind(this)} onMouseMove={this.onMouseMove.bind(this)}>
                                        <div id='backgroundMessage' className={styles.background} style={{background: `rgba(1, 1, 1, ${this.state.bgProc}`}}></div>
                                        <div id='mobileContainerMessage' className={styles.container} style={{ transform: `translateY(${this.state.styles})`}}>
                                            <div className={styles.liner} onTouchStart={this.onMouseDown.bind(this)} onTouchEnd={this.onMouseUp.bind(this)} onMouseDown={this.onMouseDown.bind(this)} onMouseUp={this.onMouseUp.bind(this)}>
                                                <div className={styles.line}></div>
                                            </div>
                                            <DiscordMessage width={this.state.width} updateButtons={this.updateButtons.bind(this)} loading={this.state.messageLoading} className={styles.mobile_message} data={`{ "embeds": [ ${this.replaceEmojiValue(this.state.data.embed)} ], "components": ${JSON.stringify(components)} }`} webhook={this.state.data.webhook} />
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
                <div id='room_settings' className={styles.settings}>
                    <TabsContainer activeTab={this.state.activeTab} onClick={this.setActiveTab.bind(this)}
                    options={
                        [
                            { label: 'Основные', strokeIcon: IconWidgetStroke, fillIcon: IconWidgetFill },
                            { label: 'Сообщение', strokeIcon: IconChatStroke, fillIcon: IconChatFill },
                            { label: 'Кнопки', strokeIcon: IconTextBStroke, fillIcon: IconTextBFill }
                        ]
                    }
                    />
                    { this.switcher() }
                </div>
            </div>
        )
    }

    async save() {
        this.setState({ saveLoading: true, messageLoading: true })

        const user = JSON.parse(localStorage.getItem('niako') || '{}')?.currentUser
        if(!user) return this.locationToOrigin()

        const rows = document.querySelectorAll('.draggable__container')
        if(!rows || !rows.length) return

        let buttons = Object.assign(this.state.data.buttons)
        rows.forEach((r, rIndex) => {
            if(!r || !r.childNodes.length) return
            
            r.childNodes.forEach((b: any, bIndex) => {
                if(!b || !b.id) return

                const name = b.id.split('Room')[1]
                if(!name || !buttons[name]) return

                if(buttons[name]?.used) {
                    buttons[name].position.row = rIndex + 1
                    buttons[name].position.button = bIndex + 1

                    if(buttons[name].position.button > 5) {
                        buttons[name].used = false
                    }
                }
            })
        })

        Object.keys(buttons).forEach((k) => {
            delete buttons[k].extendType
            delete buttons[k].custom_id
        })

        const body = { ...this.state.data, buttons: buttons }
        const response = await fetch(`${apiUrl}/private/guilds/${this.props.currecyGuildId}/voice`, {
            method: 'Put',
            headers: {
                'Authorization': user.token,
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(body)
        }).then(async (res) => await res.json()).catch(() => ({ status: false }))

        return this.setState({
            canSave: !response.status,
            data: body,
            buttons: structuredClone(buttons),
            oldData: structuredClone(body),
            messageLoading: false,
            saveLoading: false
        })
    }

    async create() {
        const user = JSON.parse(localStorage.getItem('niako') || '{}')?.currentUser
        if(!user) return this.locationToOrigin()

        this.props.setGuildState(false)
        this.setState({ createVoice: true })

        await fetch(`${apiUrl}/private/guilds/${this.props.currecyGuildId}/voice`, {
            method: 'Post',
            headers: {
                'Authorization': user.token,
                "Content-Type": 'application/json'
            }
        }).then(async (res) => await res.json()).catch(() => ({ status: false }))

        return setTimeout(() => this.componentDidMount(), 5000)
    }

    async componentDidMount() {
        this.props.setGuildState(false)
        
        this.setState({
            createVoice: false,
            data: null,
            canSave: null,
            oldData: null,
            activeTab: (window.innerWidth > 540 ? 'Основные' : 'None')
        })

        window.addEventListener('resize', () => this.setState({ showMessage: false, width: window.innerWidth }))

        const user = JSON.parse(localStorage.getItem('niako') || '{}')?.currentUser
        if(!user) return this.locationToOrigin()

        const discordInfo = await fetch(`${apiUrl}/private/guilds/${this.props.currecyGuildId}/info`, {
            headers: { 'Authorization': user.token }
        }).then(async (res) => await res.json()).catch(() => ({ status: false }))

        if(!discordInfo?.status) return this.locationToOrigin()

        const response = await fetch(`${apiUrl}/private/guilds/${this.props.currecyGuildId}/voice`, {
            headers: { 'Authorization': user.token }
        }).then(async (res) => await res.json()).catch(() => ({ status: false, message: 'error' }))

        if(!response.status) return this.locationToOrigin(response.message === 'Invalid auth token')
    
        const data = response.answer
    
        if(data.webhook.avatar.includes('/../')) {
            data.webhook.avatar = `https://niako.xyz/img/Logo.png`
        }

        this.setState({ data, oldData: structuredClone(data), buttons: structuredClone(data.buttons), discord: discordInfo.answer })

        return this.props.setGuildState(true)
    }

    componentDidUpdate(props: any, state: any) {
        if(this.state.data && this.props.currecyGuildId !== this.state.data.guildId) {
            return this.componentDidMount()
        }

        if(this.state.showMessage !== state.showMessage && this.state.showMessage) {
            const el = document.getElementById('backgroundMessage')
            if(el) {
                el.onclick = this.onCloseMessage.bind(this)
            }
        }
    }

    updateState(state: any) {
        if(state.hasOwnProperty('data')) {
            if(this.state.data && this.state.oldData) {
                state.canSave = JSON.stringify(state.data) !== JSON.stringify(this.state.oldData) || JSON.stringify(state?.buttons || this.state?.buttons) !== JSON.stringify(this.state.oldData.buttons)
                if(state.data?.embed) {
                    let parse = JSON.parse(state.data.embed)
                    if(3 > (Object.keys(parse)?.length || 0) && parse.fields.length === 0) {
                        state.canSave = false
                        this.props.sendError('Введите контент в эмбеде сообщения')
                    }
                }
            }
        }

        return this.setState({ ...state })
    }

    replaceEmojiValue(text: string) {
        return text.replace(/[$]emojiRoomRename/g, this.getButtonEmoji('Rename'))
        .replace(/[$]emojiRoomLimit/g, this.getButtonEmoji('Limit'))
        .replace(/[$]emojiRoomKick/g, this.getButtonEmoji('Kick'))
        .replace(/[$]emojiRoomOwner/g, this.getButtonEmoji('Crown'))
        .replace(/[$]emojiRoomReset/g, this.getButtonEmoji('Reset'))
        .replace(/[$]emojiRoomInfo/g, this.getButtonEmoji('Info'))
        .replace(/[$]emojiRoomMute/g, this.getButtonEmoji('Mute'))
        .replace(/[$]emojiRoomUnmute/g, this.getButtonEmoji('Unmute'))
        .replace(/[$]emojiRoomStateMute/g, this.getButtonEmoji('StateMute'))
        .replace(/[$]emojiRoomLock/g, this.getButtonEmoji('Lock'))
        .replace(/[$]emojiRoomUnlock/g, this.getButtonEmoji('Unlock'))
        .replace(/[$]emojiRoomStateLock/g, this.getButtonEmoji('StateLock'))
        .replace(/[$]emojiRoomRemoveUser/g, this.getButtonEmoji('RemoveUser'))
        .replace(/[$]emojiRoomAddUser/g, this.getButtonEmoji('AddUser'))
        .replace(/[$]emojiRoomStateUser/g, this.getButtonEmoji('StateUser'))
        .replace(/[$]emojiRoomStateHide/g, this.getButtonEmoji('StateHide'))
        .replace(/[$]emojiRoomPlusLimit/g, this.getButtonEmoji('PlusLimit'))
        .replace(/[$]emojiRoomMinusLimit/g, this.getButtonEmoji('MinusLimit'))
        .replace(/[$]emojiRoomUp/g, this.getButtonEmoji('Up'))
    }

    switcher() {     
        if(!this.state.data) {
            return ''
        }

        switch(this.state.activeTab) {
            case 'Кнопки':
                return <ButtonSettings className={styles.settings_wraper} data={this.state.data} sendError={this.props.sendError} updateState={this.updateState.bind(this)} discord={this.state.discord}/>
            case 'Сообщение':
                return <MessageSettings className={styles.settings_wraper} data={this.state.data} sendError={this.props.sendError} updateState={this.updateState.bind(this)} discord={this.state.discord}/>
            default:
                return <MainSettings setRoomLoading={this.setRoomLoading.bind(this)} className={styles.settings_wraper} buttons={this.state.buttons} data={this.state.data} sendError={this.props.sendError} updateState={this.updateState.bind(this)} discord={this.state.discord}/>
        }
    }

    setActiveTab(value: string) {
        return this.setState({ activeTab: value })
    }

    private getButtonEmoji(name: string) {
        return (this.state.data.buttons[name]?.emoji || '')
    }

    private resolveComponents() {
        const components = Object.values(
            this.state.data.buttons
        ).filter((b: any) => b.used).sort((a: any, b: any) => (
            a.position.button - b.position.button &&
            a.position.row - b.position.row
        ))

        let rows: any[][] = []
        let rowSet: number[] = []
        
        const val = Object.values(
            this.state.data.buttons
        ).filter((b: any) => b.used) as any[]
        
        for ( let i = 0; val.length > i; i++ ) {
            if(!rowSet.includes(val[i].position.row)) {
                rowSet.push(val[i].position.row)
            }
        }
        
        rowSet = rowSet.sort((a, b) => a - b)

        for ( let i = 0; rowSet.length > i; i++ ) {
            rows.push([])
            const btns = components.filter((b: any) => b.position.row === rowSet[i]).sort((a: any, b: any) => a.position.button - b.position.button) as any[]
            for ( let j = 0; (btns.length > 5 ? 5 : btns.length) > j; j++ ) {
                rows[i].push({ ...btns[j], custom_id: `manageRoom${btns[j].type}`, extendType: 'Button' })
            }
        }

        if(this.state.data.game) {
            rows.unshift(
                [
                    {
                        extendType: 'Select',
                        placeholder: 'Выберите, в какую игру хотите сыграть...'
                    }
                ]
            )
        }

        return rows
    }

    updateButtons() {
        if(!this.state.buttons) return

        const rows = document.querySelectorAll('.draggable__container')
        if(!rows || !rows.length) return

        let buttons = Object.assign(this.state.buttons)
        rows.forEach((r, rIndex) => {
            if(!r || !r.childNodes.length) return
            
            r.childNodes.forEach((b: any, bIndex) => {
                if(!b || !b.id) return

                const name = b.id.split('Room')[1]
                if(!name || !buttons[name]) return

                if(buttons[name]?.used) {
                    buttons[name].position.row = rIndex + 1
                    buttons[name].position.button = bIndex + 1
                }
            })
        })

        return this.setState({ canSave: true, buttons })
    }

    async setRoomLoading(messageLoading: boolean) {
        return this.setState({ messageLoading })
    }

    onShowMessage() {
        return this.setState({ showMessage: true, bgProc: 0.4  })
    }

    onCloseMessage() {
        return this.setState({ showMessage: false, mouseMove: false, touchEnd: 0, styles: '0px' })
    }

    onMouseDown(e: any) {
        return this.setState({ mouseMove: true })
    }

    onMouseMove(e: any) {
        if(!this.state.mouseMove) return

        const y = (e?.pageY || e?.touches[0]?.pageY)
        if(Math.round(window.innerHeight / 100 * 20) > y) return

        return this.setState({ styles: `calc((80vh - 100vh) + ${y}px)`, touchEnd: y, bgProc: (((window.innerHeight-y) / window.innerHeight) * 0.4).toFixed(2) })
    }

    onMouseUp(e: any) {
        if(!this.state.mouseMove) return

        const y = this.state.touchEnd
        if(!y || y > Math.round(window.innerHeight / 100 * 35)) {
            return this.onCloseMessage()
        }

        return this.setState({ mouseMove: false, touchEnd: 0, bgProc: 0.4, styles: '0px' })
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