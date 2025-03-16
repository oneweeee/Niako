import { Component } from "react";
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { TextDropdown } from "../../components/Dropdown/TextDropdown";
import { Button as OldButton } from "../../components/Button/Button";
import { Button } from "../../components/ButtonNew/Button";
import { Input } from "../../components/Input/Input";
import SyntaxHighlighter from 'react-syntax-highlighter';
import styles from './Database.module.scss'

import { ReactComponent as IconSearch } from '../../assets/svg/Search.svg';

export class Database extends Component<{}, { select: string, guildId: string, token: string, isAccess: boolean, loading: boolean, content: any }> {
    state = { token: '', select: '', guildId: '', isAccess: false, loading: false, content: '' }

    render() {
        if(!this.state.isAccess) {
            return (
                <div className={styles.notfound_content}>
                    <p className={styles.title}>404</p>
                    <div className={styles.description}>
                        <p className={styles.text}>Попробуйте вернуться назад или поищите что-нибудь другое</p>
                        <OldButton alignSelf='stretch' content="На главную" type='Fill' color='Primary' onClick={() => window.location.href = window.location.origin} />
                    </div>
                </div>
            )
        }
        
        return (
            <div className={styles.wrapper}>
                <div className={styles.info}>
                    <TextDropdown onClick={this.onSelectCategory.bind(this)} placeholder='Выберите нужные данные...' defaultValue={this.state.select} options={[
                        { label: 'Общая информация', value: '/info' },
                        { label: 'Конфигурация баннера', value: '/banner' },
                        { label: 'Конфигурация комнат', value: '/voice' },
                        { label: 'Конфигурация аудита', value: '/audit' }
                    ]} />
                    <Input onChange={this.onInputId.bind(this)} placeholder='Введите Id сервера...' maxLength={19} minLength={18} />
                    <Button loading={this.state.loading} width='max' disabled={!this.state.select || ![18, 19].includes(this.state.guildId.length) || isNaN(parseInt(this.state.guildId))} size='medium' styled='fill' type='action' label='Получить информацию'leftIcon={IconSearch} onClick={this.onClickGetInfo.bind(this)} />
                </div>
                <div className={styles.code}>
                    <SyntaxHighlighter style={oneDark} customStyle={{margin: 0}} language="json">
                        { JSON.stringify(this.state.content, null, '\t') }
                    </SyntaxHighlighter>
                </div>
            </div>
        )
    }

    onSelectCategory(select: string) {
        return this.setState({ select })
    }

    onInputId(e: any) {
        const guildId = e.target.value as string
        if(![18, 19].includes(guildId.length) || isNaN(parseInt(guildId))) return

        return this.setState({ guildId })
    }

    async onClickGetInfo() {
        this.setState({ loading: true })

        const res = await fetch(`https://api.niako.xyz/private/guilds/${this.state.guildId}${this.state.select}`,{
            headers: { 'Authorization': this.state.token }
        }).then(async (r) => await r.json()).catch(() => null)

        return this.setState({ content: res, loading: false })
    }

    async componentDidMount() {
        const get = JSON.parse(localStorage.getItem('niako') || '{}')?.currentUser
        if(!get) return this.locationToOrigin()

        const res = await fetch('https://api.niako.xyz/private/guilds/1092012127545462844',{
            headers: { 'Authorization': get.token }
        }).then(async (r) => await r.json()).catch(() => null)
        
        return this.setState({ token: get.token, isAccess: res?.status })
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