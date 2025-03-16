import { Component } from "react";
import styles from './EmbedBuilder.module.scss'
import { apiUrl } from "../../../../config";
import { DiscordMessage } from "../../../../components/DiscordMessage/DiscordMessage";
import { ChangeContent } from "./ChangeContent/ChangeContent";
import { ChooseAuthor } from "./ChooseAuthor/ChooseAuthor";

import { ReactComponent as IconChatLine } from '../../../../assets/svg/ChatLine.svg';

export default class EmbedBuilder extends Component<{ fonts: string[], currecyGuildId: string, setGuildState: (state: boolean) => any, sendError: Function }, { touchEnd: number, styles: any, bgProc: any, mouseMove: boolean, showMessage: boolean, sendLoading: boolean, chooser: { id?: string, type?: string }, width: number, isLoading: boolean, content: any, guildId: string, canSave: null | boolean, type: string, webhooks: any[], channels: any[] }> {
    state = {
        showMessage: false, mouseMove: false, styles: '0px', bgProc: 0, touchEnd: 0,
        isLoading: true, sendLoading: false, content: { webhook: {} } as any, guildId: this.props.currecyGuildId, chooser: {},
        type: 'Webhook', canSave: null as any, webhooks: [] as any[], width: window.innerWidth, channels:[] as any[]
    }

    render() {
        return (
            <div className={styles.plugin_wrapper}>
                <div className={styles.discord}>
                    <DiscordMessage width={this.state.width} loading={this.state.isLoading} className={styles.message} data={JSON.stringify(this.state.content)} webhook={this.state.content?.webhook || {}} />
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
                                    <div className={styles.mobile_message} onTouchMove={this.onMouseMove.bind(this)} onMouseMove={this.onMouseMove.bind(this)}>
                                        <div id='backgroundMessage' className={styles.background} style={{background: `rgba(1, 1, 1, ${this.state.bgProc}`}}></div>
                                        <div id='mobileContainerMessage' className={styles.container} style={{ transform: `translateY(${this.state.styles})`}}>
                                            <div className={styles.liner} onTouchStart={this.onMouseDown.bind(this)} onTouchEnd={this.onMouseUp.bind(this)} onMouseDown={this.onMouseDown.bind(this)} onMouseUp={this.onMouseUp.bind(this)}>
                                                <div className={styles.line}></div>
                                            </div>
                                            <DiscordMessage width={this.state.width} loading={this.state.isLoading} className={styles.message} data={JSON.stringify(this.state.content)} webhook={this.state.content?.webhook || {}} />
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    )
                }
                <div className={styles.settings}>
                    <ChooseAuthor chooser={this.state.chooser} sendLoading={this.state.sendLoading} guildId={this.props.currecyGuildId} webhooks={this.state.webhooks} channels={this.state.channels} content={this.state.content} sendError={this.props.sendError.bind(this)} isLoading={this.state.isLoading} type={this.state.type} updateState={this.updateState.bind(this)}/>
                    <div className={styles.line}></div>
                    <ChangeContent webhooks={this.state.webhooks} channels={this.state.channels} content={this.state.content} sendError={this.props.sendError.bind(this)} isLoading={this.state.isLoading} type={this.state.type} updateState={this.updateState.bind(this)}/>
                </div>
            </div>
        )
    }

    async componentDidMount() {
        this.props.setGuildState(false)

        this.setState({
            canSave: null, sendLoading: false,
            isLoading: true, guildId: this.props.currecyGuildId,
            content: { webhook: {} },
            webhooks: [], channels: [],
            type: 'Webhook', chooser: {}
        })

        const user = JSON.parse(localStorage.getItem('niako') || '{}')?.currentUser
        if(!user) return this.locationToOrigin()

        const webhookInfo = await fetch(`${apiUrl}/private/guilds/${this.props.currecyGuildId}/webhooks`, {
            headers: { 'Authorization': user.token }
        }).then(async (res) => await res.json()).catch(() => ({ status: false }))

        await this.ratelimit()

        const channelInfo = await fetch(`${apiUrl}/private/guilds/${this.props.currecyGuildId}/channels`, {
            headers: { 'Authorization': user.token }
        }).then(async (res) => await res.json()).catch(() => ({ status: false }))

        if(webhookInfo?.status && !webhookInfo?.answer?.message) {
            webhookInfo.answer = webhookInfo.answer.filter((w: any) => w.type === 1 && !w.application_id)
        }

        if(channelInfo?.status && !channelInfo?.answer?.message) {
            channelInfo.answer = channelInfo.answer.sort((a: any, b: any) => a.position - b.position).filter((c: any) => c.type === 0)
        }
        
        this.setState({
            webhooks: (webhookInfo?.status ? webhookInfo.answer : this.state.webhooks),
            channels: (channelInfo?.status ? channelInfo.answer : this.state.channels),
            isLoading: false, content: {}
        })

        window.addEventListener('resize', () => this.setState({ width: window.innerWidth }))

        return this.props.setGuildState(true)
    }

    componentDidUpdate(props: any, state: any) {
        if(this.state.guildId && props.currecyGuildId !== this.state.guildId) {
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
        return this.setState({ ...state })
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

    private ratelimit(ms: number = 1000) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}