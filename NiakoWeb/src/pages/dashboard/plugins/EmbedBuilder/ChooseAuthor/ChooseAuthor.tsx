import { Component } from "react";
import styles from './ChooseAuthor.module.scss'
import Avatar from '../../../../../assets/img/DefaultAvatar.png'
import Logo from '../../../../../assets/img/Logo-96.png';

import { Skeletone } from "../../../../../components/Skeletone/Skeletone";
import { SwitcherButtons } from "../../../../../components/SwitcherButtons/SwitcherButtons";
import { TextDropdown } from "../../../../../components/Dropdown/TextDropdown";
import { Input } from "../../../../../components/Input/Input";
import { Button } from "../../../../../components/ButtonNew/Button";

import { ReactComponent as IconCheck } from '../../../../../assets/svg/Check.svg'
import { apiUrl } from "../../../../../config";

export class ChooseAuthor extends Component<{ isLoading?: boolean, sendLoading: boolean, guildId: string, webhooks: any, chooser: { id?: string, type?: string }, channels: any, content: any, type: string, sendError: (msg: string) => any, updateState: (state: any) => any }> {
    render() {
        if(this.props.isLoading) {
            return (
                <div className={styles.wrapper}>
                    <Skeletone style={{ height: '40px' }}/>
                    <Skeletone style={{ height: '36px' }}/>
                    <Skeletone style={{ height: '112px' }}/>
                </div>
            )
        }

        return (
            <div className={styles.wrapper}>
                <Button leftIcon={IconCheck} label='Отправить' disabled={!this.props.chooser?.type} size='small' width='max' loading={this.props.sendLoading} type='action' styled='fill' onClick={this.onClickSend.bind(this)}/>
                {
                    <SwitcherButtons currencyButton={this.props.type} onClick={this.onChangeType.bind(this)} buttons={
                        [
                            { label: 'Webhook', value: 'Webhook' },
                            { label: 'Channel', value: 'Channel' }
                        ]
                    } />
                }
                {
                    this.props?.type === 'Channel' ? (
                        <div className={styles.settings}>
                            <div className={styles.cell}>
                                <div className={styles.title}>
                                    <p className={styles.text}>Канал</p>
                                </div>
                                <TextDropdown key='Channel' placeholder='Выберите канал...' onClick={this.onChooseChannel.bind(this)} defaultValue={this.props.chooser.type === 'Channel' ? this.props.chooser.id : undefined} options={this.props.channels.map((w: any) => ({ label: w.name, value: w.id }))} />
                            </div>
                        </div>
                    ) : this.props.webhooks?.message ? <p className={styles.error}>Ой... У меня недостаточно прав!</p> : (
                        <div className={styles.settings}>
                            <div className={styles.cell}>
                                <div className={styles.title}>
                                    <p className={styles.text}>Вебхук</p>
                                </div>
                                <TextDropdown key='Webhook' placeholder='Выберите вебхук...' onClick={this.onChooseWebhook.bind(this)} defaultValue={this.props.chooser.type === 'Webhook' ? this.props.chooser.id : undefined} options={this.props.webhooks.map((w: any) => ({ label: w.name, value: w.id, img: this.getAvatar(w.id, w?.avatar) }))} />
                            </div>
                        </div>
                    )
                }
                {
                    this.props.chooser?.type === 'Webhook' && this.props.type === 'Webhook' && (
                        <div className={styles.settings}>
                            <div className={styles.cell}>
                                <div className={styles.title}>
                                    <p className={styles.text}>Username</p>
                                </div>
                                <Input placeholder='Введите название...' maxLength={32} minLength={0} onChange={this.inputWebhookUsername.bind(this)} />
                            </div>
                            <div className={styles.cell}>
                                <div className={styles.title}>
                                    <p className={styles.text}>Avatar Url</p>
                                </div>
                                <Input placeholder='Вставьте ссылку...' onChange={this.inputWebhookAvatarUrl.bind(this)} />
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }

    async onClickSend() {
        this.props.updateState({
            sendLoading: true
        })

        const user = JSON.parse(localStorage.getItem('niako') || '{}')?.currentUser
        if(!user) return this.props.updateState({ sendLoading: false })

        await fetch(`${apiUrl}/private/guilds/${this.props.guildId}/builder`, {
            method: 'Post', headers: { 'Authorization': user.token, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...this.props.chooser, guildId: this.props.guildId,
                message: JSON.stringify({ ...this.props.content, ...this.props.content.webhook })
            })
        }).then(async (res) => await res.json()).catch(() => ({ status: false }))

        return this.props.updateState({
            sendLoading: false
        })
    }

    onChangeType(type: string) {
        return this.props.updateState({ type })
    }

    onChooseWebhook(id: string) {
        const webhook = this.props.webhooks.find((w: any) => w.id === id)!

        return this.props.updateState({
            content: {
                ...this.props.content,
                webhook: {
                    username: webhook.name,
                    avatarURL: this.getAvatar(id, webhook.avatar)
                }
            },
            chooser: { type: 'Webhook', url: webhook.url, id }
        })
    }

    onChooseChannel(id: string) {
        return this.props.updateState({
            content: {
                ...this.props.content,
                webhook: {
                    username: 'Niako',
                    avatarURL: Logo
                }
            },
            chooser: { type: 'Channel', channelId: id, id }
        })
    }

    inputWebhookUsername(e: any) {
        const name = e.target.value as string
        if(!name.length || !name.split('').some((s) => s !== ' ')) {
            const webhook = this.props.webhooks.find((w: any) => w.id === this.props.chooser.id)!
            if(webhook) {
                this.props.updateState({
                    content: {
                        ...this.props.content,
                        webhook: {
                            ...(this.props.content.webhook || {}),
                            username: webhook.name
                        }
                    }
                })
            }

            return this.props.sendError('Введите название вебхука')
        }

        let newName = name.split(' ').filter((s) => s.split('').filter((w) => this.isAllowWord(w)).join('') !== '').join(' ')
        if(!newName.length || newName.split('').some((w) => !this.isAllowWord(w))) {
            e.target.value = this.props.content.webhook.username
            return this.props.sendError('Некорректные символы в название вебхука')
        }
        
        return this.props.updateState({
            content: {
                ...this.props.content,
                webhook: {
                    ...(this.props.content.webhook || {}),
                    username: e.target.value
                }
            }
        })
    }

    inputWebhookAvatarUrl(e: any) {
        const url = e.target.value as string
        if(!url || url[url.length - 1] === ' ') {
            const get = this.props.webhooks.find((w: any) => w.id === this.props.chooser.id)
            if(!get) return

            return this.props.updateState({
                content: {
                    ...this.props.content,
                    webhook: {
                        ...(this.props.content.webhook || {}),
                        avatarURL: this.getAvatar(get.id, get.avatar)
                    }
                }
            })
        }

        if(!url.startsWith('http') && !url.includes('://')) {
            return this.props.sendError('Введите корректную ссылку на аватар')
        }
        
        return this.props.updateState({
            content: {
                ...this.props.content,
                webhook: {
                    ...(this.props.content.webhook || {}),
                    avatar: e.target.value
                }
            }
        })
    }

    private getAvatar(id: string, avatar: string | null) {
        if(!avatar) return Avatar

        return `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=80`
    }

    private isAllowWord(word: string) {
        return word.toLowerCase() !== word.toUpperCase() || !isNaN(parseInt(word)) || ['*', '#'].includes(word) ||  word === ' '
    }
}