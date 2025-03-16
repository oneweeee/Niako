import { Component } from "react";
import styles from './Audit.module.scss'
import { apiUrl } from "../../../../config";

import { AuditContent } from "./AuditContent/AuditContent";
import { AuditSearch } from "./AuditSearch/AuditSearch";
import { AuditTop } from "./AuditTop/AuditTop";
import { SaveButton } from "../../../../components/SaveButton/SaveButton";

export default class Audit extends Component<{ fonts: string[], currecyGuildId: string, setGuildState: (state: boolean) => any, sendError: Function }, { page: number, saveLoading: boolean, actions: { type: string, values: string[], title: string }[], isLoading: boolean, data: any, oldData: any, canSave: null | boolean, discord: any, input: string, types: string }> {
    state = {
        isLoading: true, data: null as any, oldData: null as any, input: '', saveLoading: false,
        page: 0, types: 'All', canSave: null as any, discord: null as any, actions: [
            { type: 'guildMemberAdd', values: [ 'All', 'Member' ], title: 'Вход участника' },
            { type: 'guildMemberRemove', values: [ 'All', 'Member' ], title: 'Выход участника' },
            { type: 'guildBotAdd', values: [ 'All', 'Other' ], title: 'Добавление бота' },
            { type: 'guildBotRemove', values: [ 'All', 'Other' ], title: 'Удаление бота' },
            { type: 'guildUpdate', values: [ 'All', 'Other' ], title: 'Изменение сервера' },
            { type: 'voiceStateJoin', values: [ 'All', 'Channel' ], title: 'Вход в голосовой канал' },
            { type: 'voiceStateLeave', values: [ 'All', 'Channel' ], title: 'Выход из голосового канала' },
            { type: 'voiceStateUpdate', values: [ 'All', 'Channel' ], title: 'Переход из голосового канала' },
            { type: 'channelCreate', values: [ 'All', 'Channel' ], title: 'Создание канала' },
            { type: 'channelUpdate', values: [ 'All', 'Channel' ], title: 'Изменение канала' },
            { type: 'channelDelete', values: [ 'All', 'Channel' ], title: 'Удаление канала' },
            { type: 'emojiCreate', values: [ 'All', 'StickerAndEmoji' ], title: 'Создание эмодзи' },
            { type: 'emojiUpdate', values: [ 'All', 'StickerAndEmoji' ], title: 'Изменение эмодзи' },
            { type: 'emojiDelete', values: [ 'All', 'StickerAndEmoji' ], title: 'Удаление эмодзи' },
            { type: 'stickerCreate', values: [ 'All', 'StickerAndEmoji' ], title: 'Создание стикера' },
            { type: 'stickerUpdate', values: [ 'All', 'StickerAndEmoji' ], title: 'Изменение стикера' },
            { type: 'stickerDelete', values: [ 'All', 'StickerAndEmoji' ], title: 'Удаление стикера' },
            { type: 'roleCreate', values: [ 'All', 'Role' ], title: 'Создание роли' },
            { type: 'roleUpdate', values: [ 'All', 'Role' ], title: 'Изменение роли' },
            { type: 'roleDelete', values: [ 'All', 'Role' ], title: 'Удаление роли' },
            { type: 'inviteCreate', values: [ 'All', 'Other' ], title: 'Создание приглашения' },
            { type: 'inviteDelete', values: [ 'All', 'Other' ], title: 'Удаление приглашения' },
            { type: 'guildBanAdd', values: [ 'All', 'Member' ], title: 'Блокировка участника' },
            { type: 'guildBanRemove', values: [ 'All', 'Member' ], title: 'Разблокировка участника' },
            { type: 'messageUpdate', values: [ 'All', 'Other' ], title: 'Изменение сообщения' },
            { type: 'messageDelete', values: [ 'All', 'Other' ], title: 'Удаление сообщения' },
            { type: 'guildMemberNicknameUpdate', values: [ 'All', 'Member' ], title: 'Изменение имени участника' },
            { type: 'guildMemberRoleAdd', values: [ 'All', 'Role' ], title: 'Добавление ролей участнику' },
            { type: 'guildMemberRoleRemove', values: [ 'All', 'Role' ], title: 'Удаление ролей участнику' }
        ]
    }

    render() {
        return (
            <div className={styles.plugin_wrapper}>
                <SaveButton show={this.state.canSave} loading={this.state.saveLoading} onClick={this.save.bind(this)} />
                <AuditTop isLoading={this.state.isLoading} state={this.state?.data?.state} onChangeState={this.onChangeState.bind(this)} />
                <AuditSearch isLoading={this.state.isLoading} input={this.state.input} activeFilter={this.state.types} setFilters={this.setFilters.bind(this)} />
                <div className={styles.divider}>
                    <span className={styles.line}></span>
                </div>
                <AuditContent isLoading={this.state.isLoading} updateState={this.updateState.bind(this)} setPage={this.setPage.bind(this)} page={this.state.page} discord={this.state.discord} actions={this.search()} data={this.state.data} />
            </div>
        )
    }

    async save() {
        this.setState({ saveLoading: true })

        const user = JSON.parse(localStorage.getItem('niako') || '{}')?.currentUser
        if(!user) return this.locationToOrigin()

        const body = { ...this.state.data }

        const response = await fetch(`${apiUrl}/private/guilds/${this.props.currecyGuildId}/audit`, {
            method: 'Put', headers: {
                'Authorization': user.token,
                'Content-Type': 'application/json'
            }, body: JSON.stringify(body)
        }).then(async (res) => await res.json()).catch(() => ({ status: false }))

        return this.setState({
            canSave: !response.status,
            data: body,
            oldData: structuredClone(body),
            saveLoading: false
        })
    }

    async componentDidMount() {
        this.props.setGuildState(false)

        this.setState({
            data: null,
            oldData: null,
            canSave: null,
            discord: null,
            saveLoading: false,
            isLoading: true
        })

        const user = JSON.parse(localStorage.getItem('niako') || '{}')?.currentUser
        if(!user) return this.locationToOrigin()

        const discordInfo = await fetch(`${apiUrl}/private/guilds/${this.props.currecyGuildId}/info`, {
            headers: { 'Authorization': user.token }
        }).then(async (res) => await res.json()).catch(() => ({ status: false }))

        if(discordInfo?.status) {
            discordInfo.answer.channels = discordInfo.answer.channels.sort((a: any, b: any) => a.position - b.position).filter((c: any) => [0, 11, 12].includes(c.type))
        }
        
        const response = await fetch(`${apiUrl}/private/guilds/${this.props.currecyGuildId}/audit`, {
            headers: { 'Authorization': user.token }
        }).then(async (res) => await res.json()).catch(() => ({ status: false, message: 'error' }))

        if(!response.status) return this.locationToOrigin(response.message === 'Invalid auth token')
    
        const data = response.answer

        this.setState({
            oldData: structuredClone(data),
            data, discord: discordInfo.answer,
            isLoading: false
        })

        return this.props.setGuildState(true)
    }

    componentDidUpdate() {
        if(this.state.data && this.props.currecyGuildId !== this.state.data.guildId) {
            return this.componentDidMount()
        }
    }

    setFilters(input: string, types: string) {
        return this.setState({ input, types, page: 0 })
    }

    setPage(value: number | string) {
        return this.setState({ page: Number(value) })
    }

    onChangeState() {
        return this.updateState({
            canSave: true,
            data: {
                ...this.state.data,
                state: !this.state.data.state
            }
        })
    }

    search() {
        let actons = this.state.actions
        if(this.state.input) {
            actons = this.state.actions.filter((r) => r.title.toLowerCase().includes(this.state.input.toLowerCase()))
        }

        if(this.state.types) {
            actons = actons.filter((r) => r.values.includes(this.state.types))
        }

        return actons
    }

    updateState(state: any) {
        if(state.hasOwnProperty('data')) {
            if(this.state.data && this.state.oldData) {
                state.canSave = JSON.stringify(state.data) !== JSON.stringify(this.state.oldData)
            }
        }

        return this.setState({ ...state })
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