import { Tooltip } from "@mui/material";
import { Component } from "react";
import styles from './MainSettings.module.scss'
import { Download } from "../../../../../components/Download/Download";
import { Input } from "../../../../../components/Input/Input";
import { Switcher } from "../../../../../components/Switcher/Switcher";
import { RoleDropdown } from "../../../../../components/Dropdown/RoleDropdown";
import { TextDropdown } from "../../../../../components/Dropdown/TextDropdown";
import { Button } from "../../../../../components/Button/Button";

//import { ReactComponent as IconGamepadStroke } from '../../../../../assets/svg/GamepadStroke.svg'
import { ReactComponent as IconQuestion } from '../../../../../assets/svg/QuestionStroke.svg'
import { ReactComponent as IconUserCircle } from '../../../../../assets/svg/UserCircle.svg'
import { ReactComponent as IconColorCircleDefault } from '../../../../../assets/svg/ColorCircleDefault.svg'
import { ReactComponent as IconGradientPink } from '../../../../../assets/svg/GradientPink.svg'
import { ReactComponent as IconGradientBlue } from '../../../../../assets/svg/GradientBlue.svg'
import { ReactComponent as IconGradientRed } from '../../../../../assets/svg/GradientRed.svg'
import { ReactComponent as IconGradientPurple } from '../../../../../assets/svg/GradientPurple.svg'
import { ReactComponent as IconGradientGreen } from '../../../../../assets/svg/GradientGreen.svg'
import { ReactComponent as IconGradientYellow } from '../../../../../assets/svg/GradientYellow.svg'
import { ReactComponent as IconTrash } from '../../../../../assets/svg/Trash.svg';
import { apiUrl } from "../../../../../config";
import { Modal } from "../../../../../components/Modal/Modal";

export class MainSettings extends Component<{ setRoomLoading: (state: boolean) => any, buttons: any, className: any, data: any, updateState: any, sendError: any, discord: any }, { loadAvatar: boolean, showDeleteModal: boolean, loadingDelete: boolean, emojis: { [key: string]: any }, embeds: { [key: string]: any }, components: { [key: string]: string[] } }> {
    render() {
        return (
            <div className={`${styles.settings} ${this.props.className}`} id='settings'>
                <Button type='Fill' icon={IconTrash} color='Theme' alignSelf='stretch' content='Удалить приватные комнаты' onClick={this.openDeleteModal.bind(this)} />
                <Modal show={this.state.showDeleteModal} width={304} title='Отключение комнат' description="Вы уверены, что хотите удалить систему приватных комнат?"
                onClose={this.closeDeleteModal.bind(this)} childs={
                    <Button type='Fill' color='Red' loading={this.state.loadingDelete} alignSelf='stretch' content='Удалить' onClick={this.delete.bind(this)} />
                }
                />
                <div className={styles.groups}>
                    <div className={styles.group}>
                        <p className={styles.title}>Настройки вебхука</p>
                        <div className={styles.setting_group}>
                            <div className={`${styles.cell} ${styles.column}`}>
                                <div className={styles.title}>
                                    <IconUserCircle className={styles.icon} />
                                    <p className={styles.text}>Аватар вебхука</p>
                                </div>
                                <Input value={this.props.data.webhook.avatar} placeholder='Вставьте ссылку на аватар' onChange={this.inputWebhookAvatar.bind(this)} />
                                { /* <Download id='webhook_avatar' loading={this.state.loadAvatar} accept="image/png,image/jpeg,image/jpg" onChange={this.setWebhookAvatar.bind(this)} /> */ }
                            </div>
                        </div>
                    </div>
                    <div className={styles.group}>
                        <p className={styles.title}>Имя вебхука</p>
                        <div className={styles.setting_group}>
                            <div className={`${styles.cell} ${styles.column}`}>
                                <Input value={this.props.data.webhook.username} placeholder='Название вебхука' maxLength={32} minLength={1} onChange={this.inputWebhookUsername.bind(this)} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.group}>
                        <div className={styles.setting_group}>
                            <div className={`${styles.cell} ${styles.row}`}>
                                <div className={styles.title}>
                                    <p className={styles.text}>Меню игр</p>
                                </div>
                                <Switcher state={this.props.data.game} onChange={this.switchSelectGame.bind(this)}/>
                            </div>
                            <div className={`${styles.cell} ${styles.row}`}>
                                <div className={styles.title}>
                                    <p className={styles.text}>Передача прав</p>
                                    <Tooltip componentsProps={{ tooltip: { sx: { borderRadius: '8px', color: 'var(--text-color)', backgroundColor: 'var(--primary-color)', fontSize: '0.875rem' } } }} arrow title='Передача комнаты другим участникам комнаты при выходе владельца комнаты' placement="top-start">
                                        <IconQuestion className={styles.question} />
                                    </Tooltip>
                                </div>
                                <Switcher state={this.props.data.transferRoomAtOwnerLeave} onChange={this.switchTransferPermissions.bind(this)}/>
                            </div>
                        </div>
                    </div>
                    <div className={styles.group}>
                        <div className={styles.setting_group}>
                            <div className={`${styles.cell} ${styles.row}`}>
                                <div className={styles.title}>
                                    <p className={styles.text}>Не удалять комнаты</p>
                                </div>
                                <Switcher state={this.props.data.noDeleteCreatedChannel} onChange={this.switchNoDeleteCreatedChannel.bind(this)}/>
                            </div>
                            <div className={`${styles.cell} ${styles.row}`}>
                                <div className={styles.title}>
                                    <p className={styles.text}>Управление в комнате</p>
                                    <Tooltip componentsProps={{ tooltip: { sx: { borderRadius: '8px', color: 'var(--text-color)', backgroundColor: 'var(--primary-color)', fontSize: '0.875rem' } } }} arrow title='При включении, управление приватной комнаты будет отправляться в чат голосового канала' placement="top-start">
                                        <IconQuestion className={styles.question} />
                                    </Tooltip>
                                </div>
                                <Switcher state={this.props.data.sendMessageInRoom} onChange={this.switchSendMessageInRoom.bind(this)}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.groups}>
                    <div className={styles.group}>
                        <p className={styles.title}>Настройки по умолчанию</p>
                        <div className={styles.setting_group}>
                            <div className={`${styles.cell} ${styles.column}`}>
                                <div className={styles.title}>
                                    <p className={styles.text}>Роли блокировки</p>
                                    <Tooltip componentsProps={{ tooltip: { sx: { borderRadius: '8px', color: 'var(--text-color)', backgroundColor: 'var(--primary-color)', fontSize: '0.875rem' } } }} arrow title='Роли от которых буду скрываться или закрываться комнаты и наоборот' placement="top-start">
                                        <IconQuestion className={styles.question} />
                                    </Tooltip>
                                </div>
                                <RoleDropdown placeholder={'Выберите роли сервера...'} input={true} maxCount={4} sendError={this.props.sendError} options={
                                    (this.props.discord.roles as any[]).filter((r) => {
                                        if(r?.tags && Object.keys(r.tags).length > 0) {
                                            return false
                                        }
                                        return true
                                    }).sort((a, b) => b.position - a.position).map((r) => ({ label: r.name, value: r.id, default: this.props.data.defaultBlockRoles.includes(r.id), color: r.color.toString(16) }))
                                } onClick={this.selectDefaultBlockRoles.bind(this)} defaultValues={this.props.data.defaultBlockRoles} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.rows}>
                        <div className={styles.group}>
                            <p className={styles.title}>Названия комнаты по умолчанию</p>
                            <div className={styles.setting_group}>
                                <div className={`${styles.cell} ${styles.column}`}>
                                    <Input value={this.props.data.default.roomName} placeholder='$username' maxLength={32} minLength={1} onChange={this.inputDefaultRoomName.bind(this)} />
                                </div>
                            </div>
                        </div>
                        <div className={styles.group}>
                            <p className={styles.title}>Лимит комнаты по умолчанию (0-99)</p>
                            <div className={styles.setting_group}>
                                <div className={`${styles.cell} ${styles.column}`}>
                                    <Input value={this.props.data.default.roomLimit} placeholder='0' max={99} min={0} maxLength={2} minLength={1} onChange={this.inputDefaultRoomLimit.bind(this)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.groups}>
                    <div className={`${styles.group} ${styles.setting_custom_group}`}>
                        <p className={styles.title}>Кастомизация</p>
                        <div className={styles.setting_group}>
                            <div className={`${styles.cell} ${styles.column}`}>
                                <div className={styles.title}>
                                    <p className={styles.text}>Стиль иконок</p>
                                </div>
                                <TextDropdown defaultValue={this.props.data.style} placeholder={'Выберите стиль приватных комнат...'} placement='top'
                                onClick={this.onClickEmojisStyle.bind(this)} options={
                                    [
                                        { label: 'Обычный', value: 'Default', icon: <IconColorCircleDefault className={styles.icon} /> },
                                        { label: 'Розовый', value: 'Pink', icon: <IconGradientPink className={styles.icon} /> },
                                        { label: 'Голубой', value: 'Blue', icon: <IconGradientBlue className={styles.icon} /> },
                                        { label: 'Красный', value: 'Red', icon: <IconGradientRed className={styles.icon} /> },
                                        { label: 'Фиолетовый', value: 'Purple', icon: <IconGradientPurple className={styles.icon} /> },
                                        { label: 'Зелёный', value: 'Green', icon: <IconGradientGreen className={styles.icon} /> },
                                        { label: 'Желтый', value: 'Yellow', icon: <IconGradientYellow className={styles.icon} /> }
                                    ]
                                }
                                />
                            </div>
                            <div className={`${styles.cell} ${styles.column}`}>
                                <div className={styles.title}>
                                    <p className={styles.text}>Цвет сообщений</p>
                                </div>
                                <div className={styles.color_picker}>
                                    <input id='colorPicker' className={styles.picker} value={this.props.data.color} onChange={this.pickerColor.bind(this)} type='color' style={{ background: this.props.data.color }} />
                                    <Input id='colorInput' align="left" value={this.props.data.color} onChange={this.inputColor.bind(this)} maxLength={7} minLength={7} />
                                </div>
                            </div>
                        </div>
                        <div className={styles.setting_group}>
                            <div className={`${styles.cell} ${styles.column}`}>
                                <div className={styles.title}>
                                    <p className={styles.text}>Тип приватных комнат</p>
                                </div>
                                <TextDropdown defaultValue={this.props.data.type} placeholder={'Выберите тип приватных комнат...'} placement='top' options={
                                    [
                                        { label: 'Обычный', value: 'Default' },
                                        { label: 'Компактный', value: 'Compact' },
                                        { label: 'Полный', value: 'Full' }
                                    ]
                                } onClick={this.onClickPanelStyle.bind(this)}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    openDeleteModal() {
        return this.setState({ showDeleteModal: true })
    }

    closeDeleteModal() {
        return this.setState({ showDeleteModal: false })
    }

    async delete() {
        const user = JSON.parse(localStorage.getItem('niako') || '{}')?.currentUser
        if(!user) return this.locationToOrigin()

        this.setState({ loadingDelete: true })

        setTimeout(async () => {                
            await fetch(`${apiUrl}/private/guilds/${this.props.data.guildId}/voice`, {
                method: 'Delete',
                headers: {
                    'Authorization': user.token,
                    "Content-Type": 'application/json'
                }
            }).then(async (res) => await res.json()).catch(() => ({ status: false }))

            this.closeDeleteModal()

            return setTimeout(() => {
                this.props.updateState({
                    canSave: false,
                    data: {
                        ...this.props.data,
                        state: false
                    }
                })
            }, 1)
        }, 1000)
    }

    async inputWebhookAvatar(e: any) {
        const url = e.target.value as string
        if(!url.startsWith('http') || 4 > url.split('/').length) {
            return this.props.sendError('Недействительная ссылка на аватар')
        }

        const allow = [ 'jpeg', 'jpg', 'png' ]
        if(!allow.some((str) => url.includes(`.${str}`))) {
            return this.props.sendError('Недопустимое расширение файла')
        }

        return this.loadImage(url).then(() => {
            this.props.updateState({
                canSave: true,
                data: {
                    ...this.props.data,
                    webhook: {
                        ...this.props.data.webhook,
                        avatar: url
                    }
                }
            })
        }).catch(() => {})
    }

    loadImage(imageURL: string) {
        return new Promise((resolve, reject) => {
            const image = new Image()
            image.onload = () => {
                resolve(imageURL)
            }
            image.onerror = () => {
                this.props.sendError('Неизвестная ссылка на фон баннера')
            }
            image.src = imageURL
        })
    }

    async setWebhookAvatar(e: any) {
        this.setState({ loadAvatar: true })

        let file = e.target.files[0]
        if(!file) return

        if(file.size > 512 * 512) {
            return this.props.sendError('Размер файла привышает 1МБ')
        }

        let formData = new FormData()
        formData.append('file', file)

        const response = await fetch(`${apiUrl}/public/images/upload`, {
            method: 'Post',
            headers: {
                "Authorization": `Bearer ${JSON.parse(localStorage.getItem('react')!)?.currentUser?.token}`
            },
            body: formData
        }).then(async (res) => await res.json())

        if(!response?.status) {
            return this.props.sendError(response?.message || 'Слишком большой размер файла')
        }

        this.setState({ loadAvatar: false })

        return this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                webhook: {
                    ...this.props.data.webhook,
                    avatar: response.answer
                }
            }
        })
    }

    inputWebhookUsername(e: any) {
        const name = e.target.value as string
        if(!name.length || !name.split('').some((s) => s !== ' ')) {
            return this.props.sendError('Введите название вебхука')
        }

        let newName = name.split(' ').filter((s) => s.split('').filter((w) => this.isAllowWord(w)).join('') !== '').join(' ')
        if(!newName.length || newName.split('').some((w) => !this.isAllowWord(w))) {
            e.target.value = this.props.data.webhook.username
            return this.props.sendError('Некорректные символы в название вебхука')
        }
        
        return this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                webhook: {
                    ...this.props.data.webhook,
                    username: newName
                }
            }
        })
    }

    switchSelectGame() {
        this.props.setRoomLoading(true)
        
        this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                game: !this.props.data.game,
                buttons: structuredClone(this.props.buttons)
            }
        })

        return setTimeout(() => {
            return this.props.setRoomLoading(false)
        }, 300)
    }

    switchTransferPermissions() {
        return this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                transferRoomAtOwnerLeave: !this.props.data.transferRoomAtOwnerLeave
            }
        })
    }

    switchSendMessageInRoom() {
        return this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                sendMessageInRoom: !this.props.data.sendMessageInRoom
            }
        })
    }

    switchNoDeleteCreatedChannel() {
        return this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                noDeleteCreatedChannel: !this.props.data.noDeleteCreatedChannel
            }
        })
    }

    selectDefaultBlockRoles(ids: string[]) {
        if(!ids.length) {
            ids = [ this.props.data.guildId ]
        }

        return this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                defaultBlockRoles: ids
            }
        })
    }

    inputDefaultRoomName(e: any) {
        const name = e.target.value
        if(!name.length) {
            return this.props.sendError('Введите название комнаты по умолчанию')
        }

        if(name[name.length-1] === ' ') return

        return this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                default: {
                    ...this.props.data.default,
                    roomName: name
                }
            }
        })
    }

    inputDefaultRoomLimit(e: any) {
        const limit = e.target.value
        if(!limit.length || isNaN(parseInt(limit))) {
            return this.props.sendError('Введите числовое заначение лимита')
        }

        if(0 > Number(limit)) {
            return this.props.sendError('Введите число от 0 до 99')
        }

        if(limit[limit.length-1] === ' ') return

        return this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                default: {
                    ...this.props.data.default,
                    roomLimit: parseInt(limit)
                }
            }
        })
    }

    onClickEmojisStyle(value: string) {
        const emojis = this.state.emojis[value as 'Default']
        if(!emojis) return

        const keys = Object.keys(this.props.data.buttons)
        const buttons = { ...this.props.data.buttons }
        for ( let i = 0; keys.length > i; i++ ) {
            if(emojis[keys[i] as 'Up']) {
                if(emojis[keys[i] as 'Up'].startsWith('<:NK_')) {
                    buttons[keys[i] as 'Up'].label = ''
                    buttons[keys[i] as 'Up'].emoji = emojis[keys[i] as 'Up']
                } else {
                    buttons[keys[i] as 'Up'].emoji = ''
                    buttons[keys[i] as 'Up'].label = emojis[keys[i] as 'Up']
                }
            }
        }

        return this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                style: value,
                buttons
            },
            buttons: structuredClone(buttons)
        })
    }

    pickerColor(e: any) {
        const color = e.target.value as string
        const el = document.getElementById('colorInput') as any
        if(el) {
            el.value = color
        }
        
        return this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                color
            }
        })
    }

    inputColor(e: any) {
        let color = e.target.value as string
        if(color.length !== 7 && !color.startsWith('#')) {
            return this.props.sendError('Укажите #HEX код цвета')
        }

        if(color.split('').some((w) => !this.isAllowWord(w) && w !== '#')) {
            return this.props.sendError('Некорректные символы в дефолтном цвете')
        }

        const discord = this.convertColor(color)
        if(discord === '65793') {
            color = '#010101'
        }

        return this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                color
            }
        })
    }

    onClickPanelStyle(value: string) {
        this.props.setRoomLoading(true)

        const embed = this.state.embeds[value as 'Default']
        const components = this.state.components[value as 'Default']
        if(!embed || !components) return

        const rowSize = value === 'Compact' ? 4 : 5

        const buttons = this.props.data.buttons
        Object.keys(buttons).map((k) => {
            buttons[k].used = false
            return buttons[k]
        })

        components.map((k) => {
            buttons[k].used = true
            buttons[k].style = 2
            buttons[k].position.row = Math.trunc((components.indexOf(k))/rowSize)
            buttons[k].position.button = Math.trunc((components.indexOf(k)+1) / 2)
            return buttons[k]
        })

        this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                embed: JSON.stringify(embed),
                buttons
            },
            buttons: structuredClone(buttons)
        })

        return setTimeout(() => {
            return this.props.setRoomLoading(false)
        }, 300)
    }

    state = {
        loadAvatar: false,
        loadingDelete: false,
        showDeleteModal: false,
        embeds: {
            'Default': {"color":3092790,"title":"Управление приватной комнатой","description":"> Жми следующие кнопки, чтобы настроить свою комнату","footer":{"text":"Использовать их можно только когда у тебя есть приватный канал"},"fields":[{"name":"** **","inline":true,"value":"$emojiRoomLimit — Установить лимит\n$emojiRoomLock — Закрыть комнату\n$emojiRoomUnlock — Открыть комнату\n$emojiRoomRemoveUser — Забрать доступ\n$emojiRoomAddUser — Выдать доступ"},{"name":"** **","inline":true,"value":"$emojiRoomRename — Сменить название\n$emojiRoomOwner — Передать владельца\n$emojiRoomKick — Выгнать из комнаты\n$emojiRoomMute — Забрать право говорить\n$emojiRoomUnmute — Вернуть право говорить"}]},
            'Compact': {"color":3092790,"title":"Управление приватным каналом","description":"$emojiRoomStateLock — Закрыть/открыть канал\n$emojiRoomStateHide — Скрыть/показать канал\n$emojiRoomStateMute — Забрать/выдать право говорить\n$emojiRoomStateUser — Забрать/выдать доступ\n$emojiRoomKick — Выгнать пользователя\n$emojiRoomOwner — Назначить нового владельца канала\n$emojiRoomRename — Изменить название\n$emojiRoomLimit — Установить лимит пользователей"},
            'Full': {"color":3092790,"title":"Управление приватным каналом","description":"> Жми следующие кнопки, чтобы настроить свою комнату\n> Использовать их можно только когда у тебя есть приватный канал\n\n$emojiRoomRename — `изменить название комнаты`\n$emojiRoomLimit — `установить лимит пользователей`\n$emojiRoomStateLock — `закрыть/открыть доступ в комнату`\n$emojiRoomStateHide — `скрыть/раскрыть комнату для всех`\n$emojiRoomStateUser — `забрать/выдать доступ к комнате пользователю`\n$emojiRoomStateMute — `забрать/выдать право говорить пользователю`\n$emojiRoomKick — `выгнать пользователя из комнаты`\n$emojiRoomReset — `сбросить права пользователю`\n$emojiRoomOwner — `сделать пользователя новым владельцем`\n$emojiRoomInfo — `информация о комнате`"}
        },
        components: {
            'Default': [ 'Limit', 'Lock', 'Unlock', 'RemoveUser', 'AddUser', 'Rename', 'Crown', 'Kick', 'Mute', 'Unmute' ],
            'Compact': [ 'StateLock', 'StateHide', 'StateMute', 'StateUser', 'Kick', 'Crown', 'Rename', 'Limit' ],
            'Full': [ 'Rename', 'Limit', 'StateLock', 'StateHide', 'StateUser', 'StateMute', 'Kick', 'Reset', 'Crown', 'Info' ]
        },
        emojis: {
            'Default': {
                'Crown': '<:NK_RoomCrown:1103924936067792997>',
                'Rename': '<:NK_RoomRename:1103924955239944212>',
                'Limit': '<:NK_RoomLimit:1103924942141128754>',
                'Kick': '<:NK_RoomKick:1103924940568264734>',
                'Lock': '<:NK_RoomLock:1103924944745807882>',
                'Unlock': '<:NK_RoomUnlock:1103924962588364852>',
                'RemoveUser': '<:NK_RoomRemoveUser:1103924953302175805>',
                'AddUser': '<:NK_RoomAddUser:1103924933261787146>',
                'Mute': '<:NK_RoomMute:1103924949036564601>',
                'Unmute': '<:NK_RoomUnmute:1103925037486067732>',
                'StateHide': '<:NK_RoomShowed:1103924960281505792>',
                'StateUser': '<:NK_RoomUsered:1103924965281112186>',
                'StateLock': '<:NK_RoomLocked:1103924946264146001>',
                'StateMute': '<:NK_RoomMuted:1103924950668156928>',
                'Reset': '<:NK_RoomReset:1103924958041751572>',
                'Info': '<:NK_RoomInfo:1103924937854550067>',
                'MinusLimit': '<:NK_RoomLimitMinus:1125606983412744282>',
                'PlusLimit': '<:NK_RoomLimitPlus:1125606986495574046>',
                'Up': 'Поднять комнату'
            },
            'Pink': {
                'Crown': '<:NK_SPinkRoomCrown:1106583555695448086>',
                'Rename': '<:NK_SPinkRoomRename:1106583576314646689>',
                'Limit': '<:NK_SPinkRoomLimit:1106583562897080432>',
                'Kick': '<:NK_SPinkRoomKick:1106583560657305730>',
                'Lock': '<:NK_SPinkRoomLock:1106583565862453340>',
                'Unlock': '<:NK_SPinkRoomUnlock:1106583583881183242>',
                'RemoveUser': '<:NK_SPinkRoomRemoveUser:1106583574997635073>',
                'AddUser': '<:NK_SPinkRoomAddUser:1106583552818171965>',
                'Mute': '<:NK_SPinkRoomMute:1106583570358734929>',
                'Unmute': '<:NK_SPinkRoomUnmute:1106583585399505056>',
                'StateHide': '<:NK_SPinkRoomShowed:1106583580823519265>',
                'StateUser': '<:NK_SPinkRoomUsered:1106583629401956405>',
                'StateLock': '<:NK_SPinkRoomLocked:1106583567397568582>',
                'StateMute': '<:NK_SPinkRoomMuted:1106583572258770984>',
                'Reset': '<:NK_SPinkRoomReset:1106583579481350214>',
                'Info': '<:NK_SPinkRoomInfo:1106583557465460776>',
                'MinusLimit': '<:NK_SPinkRoomLimitMinus:1125607252217315348>',
                'PlusLimit': '<:NK_SPinkRoomLimitPlus:1125607254637432883>'
            },
            'Blue': {
                'Crown': '<:NK_SBlueRoomCrown:1106586088652423280>',
                'Rename': '<:NK_SBlueRoomRename:1106586110005616810>',
                'Limit': '<:NK_SBlueRoomLimit:1106586094977425409>',
                'Kick': '<:NK_SBlueRoomKick:1106586093316493343>',
                'Lock': '<:NK_SBlueRoomLock:1106586097871495258>',
                'Unlock': '<:NK_SBlueRoomUnlock:1106586117601497109>',
                'RemoveUser': '<:NK_SBlueRoomRemoveUser:1106586108084621333>',
                'AddUser': '<:NK_SBlueRoomAddUser:1106586084550385696>',
                'Mute': '<:NK_SBlueRoomMute:1106586102984355891>',
                'Unmute': '<:NK_SBlueRoomUnmute:1106586119623147562>',
                'StateHide': '<:NK_SBlueRoomShowed:1106586115072331847>',
                'StateUser': '<:NK_SBlueRoomUsered:1106586122580135936>',
                'StateLock': '<:NK_SBlueRoomLocked:1106586099729580155>',
                'StateMute': '<:NK_SBlueRoomMuted:1106586105085706271>',
                'Reset': '<:NK_SBlueRoomReset:1106586112950018068>',
                'Info': '<:NK_SBlueRoomInfo:1106586090602758234>',
                'MinusLimit': '<:NK_SBlueRoomLimitMinus:1125607219594018896>',
                'PlusLimit': '<:NK_SBlueRoomLimitPlus:1125607222634872964>'
            },
            'Red': {
                'Crown': '<:NK_SRedRoomCrown:1106598273130696794>',
                'Rename': '<:NK_SRedRoomRename:1106598296119676978>',
                'Limit': '<:NK_SRedRoomLimit:1106598281154408509>',
                'Kick': '<:NK_SRedRoomKick:1106598277853491200>',
                'Lock': '<:NK_SRedRoomLock:1106598282500788356>',
                'Unlock': '<:NK_SRedRoomUnlock:1106598303631687710>',
                'RemoveUser': '<:NK_SRedRoomRemoveUser:1106598294131576862>',
                'AddUser': '<:NK_SRedRoomAddUser:1106598269636857890>',
                'Mute': '<:NK_SRedRoomMute:1106598288574124132>',
                'Unmute': '<:NK_SRedRoomUnmute:1106598305590423643>',
                'StateHide': '<:NK_SRedRoomShowed:1106598300636954685>',
                'StateUser': '<:NK_SRedRoomUsered:1106598308794871818>',
                'StateLock': '<:NK_SRedRoomLocked:1106598286351147080>',
                'StateMute': '<:NK_SRedRoomMuted:1106598291594027078>',
                'Reset': '<:NK_SRedRoomReset:1106598298908897400>',
                'Info': '<:NK_SRedRoomInfo:1106598274674196602>',
                'MinusLimit': '<:NK_SRedRoomLimitMinus:1125607486389497867>',
                'PlusLimit': '<:NK_SRedRoomLimitPlus:1125607487844921446>'
            },
            'Purple': {
                'Crown': '<:NK_SPurpleRoomCrown:1106598172085731410>',
                'Rename': '<:NK_SPurpleRoomRename:1106598193308913745>',
                'Limit': '<:NK_SPurpleRoomLimit:1106598179849371738>',
                'Kick': '<:NK_SPurpleRoomKick:1106598178091958272>',
                'Lock': '<:NK_SPurpleRoomLock:1106598182659575942>',
                'Unlock': '<:NK_SPurpleRoomUnlock:1106598200309186580>',
                'RemoveUser': '<:NK_SPurpleRoomRemoveUser:1106598191727656991>',
                'AddUser': '<:NK_SPurpleRoomAddUser:1106598170856792225>',
                'Mute': '<:NK_SPurpleRoomMute:1106598187168436304>',
                'Unmute': '<:NK_SPurpleRoomUnmute:1106598244458438676>',
                'StateHide': '<:NK_SPurpleRoomShowed:1106598197163470879>',
                'StateUser': '<:NK_SPurpleRoomUsered:1106598203048079413>',
                'StateLock': '<:NK_SPurpleRoomLocked:1106598184261799977>',
                'StateMute': '<:NK_SPurpleRoomMuted:1106598188976189560>',
                'Reset': '<:NK_SPurpleRoomReset:1106598195980664872>',
                'Info': '<:NK_SPurpleRoomInfo:1106598175265017916>',
                'MinusLimit': '<:NK_SPurpleRoomLimitMinus:1125607125507391498>',
                'PlusLimit': '<:NK_SPurpleRoomLimitPlus:1125607128716025997>'
            },
            'Green': {
                'Crown': '<:NK_SGreenRoomCrown:1106598332635303976>',
                'Rename': '<:NK_SGreenRoomRename:1106598355846574222>',
                'Limit': '<:NK_SGreenRoomLimit:1106598340998725813>',
                'Kick': '<:NK_SGreenRoomKick:1106598338004005055>',
                'Lock': '<:NK_SGreenRoomLock:1106598342508687490>',
                'Unlock': '<:NK_SGreenRoomUnlock:1106598363853488129>',
                'RemoveUser': '<:NK_SGreenRoomRemoveUser:1106598354198216834>',
                'AddUser': '<:NK_SGreenRoomAddUser:1106598329170796645>',
                'Mute': '<:NK_SGreenRoomMute:1106598347869011988>',
                'Unmute': '<:NK_SGreenRoomUnmute:1106598365543805001>',
                'StateHide': '<:NK_SGreenRoomShowed:1106598360632283136>',
                'StateUser': '<:NK_SGreenRoomUsered:1106598368840523777>',
                'StateLock': '<:NK_SGreenRoomLocked:1106598345234985091>',
                'StateMute': '<:NK_SGreenRoomMuted:1106598351299956816>',
                'Reset': '<:NK_SGreenRoomReset:1106598358757408939>',
                'Info': '<:NK_SGreenRoomInfo:1106598334799544482>',
                'PlusLimit': '<:NK_SGreenRoomLimitPlus:1125607292797194261>',
                'MinusLimit': '<:NK_SGreenRoomLimitMinus:1125607290007990292>'
            },
            'Yellow': {
                'Crown': '<:NK_SYellowRoomCrown:1106598551208853615>',
                'Rename': '<:NK_SYellowRoomRename:1106598570964045824>',
                'Limit': '<:NK_SYellowRoomLimit:1106598557265449001>',
                'Kick': '<:NK_SYellowRoomKick:1106598555277340692>',
                'Lock': '<:NK_SYellowRoomLock:1106598559865897040>',
                'Unlock': '<:NK_SYellowRoomUnlock:1106598578337619978>',
                'RemoveUser': '<:NK_SYellowRoomRemoveUser:1106598568908832820>',
                'AddUser': '<:NK_SYellowRoomAddUser:1106598548172181564>',
                'Mute': '<:NK_SYellowRoomMute:1106598564274122884>',
                'Unmute': '<:NK_SYellowRoomUnmute:1106598580120195213>',
                'StateHide': '<:NK_SYellowRoomShowed:1106598575321919559>',
                'StateUser': '<:NK_SYellowRoomUsered:1106598582909419674>',
                'StateLock': '<:NK_SYellowRoomLocked:1106598561518473216>',
                'StateMute': '<:NK_SYellowRoomMuted:1106598566094446612>',
                'Reset': '<:NK_SYellowRoomReset:1106598573786796172>',
                'Info': '<:NK_SYellowRoomInfo:1106598552446189710>',
                'MinusLimit': '<:NK_SYellowRoomLimitMinus:1125607195007012934>',
                'PlusLimit': '<:NK_SYellowRoomLimitPlus:1125607198114992199>'
            }
        }
    }

    private convertColor(hex: string) {
        if (hex.length % 2) { hex = '0' + hex.replace('#', '') }
        try {
            const bn = BigInt('0x' + hex)
            return bn.toString(10) 
        } catch {
            return BigInt('0x010101').toString(10)
        }
    }

    private isAllowWord(word: string) {
        return word.toLowerCase() !== word.toUpperCase() || !isNaN(parseInt(word)) || word === ' '
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