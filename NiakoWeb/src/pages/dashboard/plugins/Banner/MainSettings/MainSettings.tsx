import { Component } from "react";
import { SwitcherButtons } from "../../../../../components/SwitcherButtons/SwitcherButtons";
import { Switcher } from "../../../../../components/Switcher/Switcher";
import { Download } from "../../../../../components/Download/Download";
import { TextDropdown } from "../../../../../components/Dropdown/TextDropdown";
import { Input } from "../../../../../components/Input/Input";
import styles from './MainSettings.module.scss'

import { ReactComponent as IconDownload } from '../../../../../assets/svg/Download.svg'
import { ReactComponent as IconPower } from '../../../../../assets/svg/PowerFill.svg'
import { ReactComponent as IconHD } from '../../../../../assets/svg/HD.svg'
import { ReactComponent as IconPanorama } from '../../../../../assets/svg/Panorama.svg'
import { ReactComponent as IconUserCircle } from '../../../../../assets/svg/UserCircle.svg'
import { ReactComponent as IconPodcastStroke } from '../../../../../assets/svg/PodcastStroke.svg'
import { ReactComponent as IconPodcastFill } from '../../../../../assets/svg/PodcastFill.svg'
import { ReactComponent as IconDialogStroke } from '../../../../../assets/svg/DialogStroke.svg'
import { ReactComponent as IconDialogFill } from '../../../../../assets/svg/DialogFill.svg'
import { Skeletone } from "../../../../../components/Skeletone/Skeletone";
import { apiUrl } from "../../../../../config";

export class MainSettings extends Component<{ className: any, setBackground: Function, data: any, focusLock: Function, boostCount: number, currecyGuildId: string, sendError: Function, itemsResize: (items: any[], normal: boolean) => any, loadImage: (img: any, bg?: boolean, cS?: boolean) => any, updateBannerState: (state: any) => any }, { loadBanner: boolean }> {
    state = { loadBanner: false }
    
    render() {
        return (
            <div className={`${styles.settings} ${this.props.className}`} id='settings'>
                <div className={styles.group}>
                    <p className={styles.title}>Баннер</p>
                    <div className={`${styles.setting_group} ${styles.group_download}`}>
                        <div className={`${styles.column} ${styles.cell}`}>
                            <div className={styles.title}>
                                <IconDownload className={styles.icon}/>
                                <p className={styles.text}>Изображение</p>
                            </div>
                            { <Input onChange={this.inputBackground.bind(this)} value={this.props.data.background} placeholder="Вставьте ссылку..." /> }
                            { /*!this.props.data ? <Skeletone type='button' /> : <Download id='background' loading={this.state.loadBanner} accept={this.props.boostCount > 6 ? "image/png,image/jpeg,image/gif" : "image/png,image/jpeg"} onChange={this.setBackground.bind(this)} />*/ }
                        </div>
                        <div className={styles.setting_group}>
                            <div className={`${styles.row} ${styles.cell}`}>
                                <div className={styles.title}>
                                    <IconPower className={styles.icon}/>
                                    <p className={styles.text}>Включить баннер</p>
                                </div>
                                { !this.props.data ? <Skeletone type='switcher' /> : <Switcher state={this.props.data.state} onChange={this.setModuleState.bind(this)} /> }
                            </div>
                            <div className={`${styles.row} ${styles.cell}`}>
                                <div className={styles.title}>
                                    <IconHD className={styles.icon}/>
                                    <p className={styles.text}>Увеличенное качество</p>
                                </div>
                                { !this.props.data ? <Skeletone type='switcher' /> : <Switcher state={this.props.data.type === 'Normal'} onChange={this.setType.bind(this)} /> }
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.group}>
                    <p className={styles.title}>Время обновления</p>
                    <div className={styles.setting_group}>
                        <div className={`${styles.column} ${styles.cell}`}>
                            <div className={styles.title}>
                                <IconPanorama className={styles.icon}/>
                                <p className={styles.text}>Баннер</p>
                            </div>
                            { !this.props.data && <Skeletone type='dropdown' /> }
                            { this.props.data && <TextDropdown defaultValue={this.props.data.updated} onClick={this.setUpdateBanner.bind(this)}
                            options={new Array(5).fill(null).map((n, i) => ({ label: `${i+1} минут${i+1 === 1 ? 'а' : i+1 !== 5 ? 'ы' : ''}`, value: `${i+1}m` }))}
                            /> }
                        </div>
                        <div className={`${styles.column} ${styles.cell}`}>
                            <div className={styles.title}>
                                <IconUserCircle className={styles.icon}/>
                                <p className={styles.text}>Активный участник</p>
                            </div>
                            { !this.props.data && <Skeletone type='dropdown' /> }
                            { this.props.data && <TextDropdown defaultValue={this.props.data.activeUserUpdated} onClick={this.setUpdateActiveMember.bind(this)}
                            options={
                                [
                                    { label: '10 минут', value: '10m' },
                                    { label: '15 минут', value: '15m' },
                                    { label: '30 минут', value: '30m' },
                                    { label: '1 час', value: '1h' },
                                    { label: '2 часа', value: '2h' },
                                    { label: '3 часа', value: '3h' },
                                    { label: '4 часа', value: '4h' },
                                    { label: '5 часов', value: '5h' },
                                    { label: '6 часов', value: '6h' },
                                    { label: '12 часов', value: '12h' },
                                    { label: '1 день', value: '1d' }
                                ]
                            }
                            /> }
                        </div>
                    </div>
                </div>
                <div className={styles.group}>
                    <p className={styles.title}>Статус самого активного по умолчанию</p>
                    <div className={styles.setting_group}>
                        <div className={`${styles.column} ${styles.cell}`}>
                        { !this.props.data ? <Skeletone type='input' /> : <Input value={this.props.data.activeUserStatus} placeholder='Напишите статус'
                        maxLength={32} minLength={1} onChange={this.setActiveMemberStatus.bind(this)} /> }
                        </div>
                    </div>
                </div>
                <div className={styles.group}>
                    <p className={styles.title}>Выбор типа активного участника</p>
                    <div className={styles.setting_group}>
                        <div className={`${styles.column} ${styles.cell}`}>
                            { !this.props.data && <Skeletone type='button' /> }
                            { this.props.data && <SwitcherButtons currencyButton={this.props.data.activeType || 'Online'} onClick={this.setActiveMemberType.bind(this)}
                            buttons={
                                [
                                    { label: 'Текстовый', value: 'Message', iconFill: IconDialogFill, iconStroke: IconDialogStroke },
                                    { label: 'Голосовой', value: 'Online', iconFill: IconPodcastFill, iconStroke: IconPodcastStroke }
                                ]
                            } /> }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    async inputBackground(e: any) {
        const url = e.target.value as string
        if(!url.startsWith('http') || 4 > url.split('/').length) {
            return this.props.sendError('Недействительная ссылка на фон')
        }

        const allow = [ 'gif', 'jpeg', 'jpg', 'png' ]
        if(!allow.some((str) => url.includes(`.${str}`))) {
            return this.props.sendError('Недопустимое расширение файла')
        }

        if(url.includes('.gif') && 7 > this.props.boostCount) {
            return this.props.sendError('Это премиальная возможность')
        }

        return this.props.loadImage(url, true, true)
    }

    async setBackground(e: any) {
        this.setState({ loadBanner: true })

        const image = e.target.files[0]
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

        await this.props.loadImage(response.answer, true)
        
        this.setState({ loadBanner: false })

        return this.props.updateBannerState({
            canSave: true,
            data: {
                ...this.props.data,
                background: response.answer
            }
        })
    }

    setModuleState() {
        return this.props.updateBannerState({
            canSave: true,
            data: {
                ...this.props.data,
                state: !this.props.data.state
            }
        })
    }

    setType() {
        const normal = this.props.data.type === 'Normal'

        if(!normal && this.props.data.background.endsWith('.gif')) {
            return this.props.sendError('Анимированые баннера могут быть только сжатыми')
        }

        return this.props.updateBannerState({
            canSave: true,
            width: normal ? 540 : 960,
            height: normal ? 300 : 540,
            data: {
                ...this.props.data,
                type: normal ? 'Compressed' : 'Normal',
                items: this.props.itemsResize(this.props.data.items, !normal)
            }
        })
    }

    setUpdateBanner(value: string) {
        let arr: string[] = []

        switch((this.props.boostCount || 0)) {
            case 0:
            case 1:
                arr = [ '5m' ]
                break
            case 2:
            case 3:
            case 4:
                arr = [ '5m', '4m', '3m' ]
                break
            case 5:
                arr = [ '5m', '4m', '3m', '2m' ]
                break
            default:
                arr = [ '5m', '4m', '3m', '2m', '1m' ]
                break
        }

        if(!arr.includes(value)) {
            return this.props.sendError('Это премиальная возможность')
        }

        return this.props.updateBannerState({
            canSave: true,
            data: {
                ...this.props.data,
                updated: value
            }
        })
    }

    setUpdateActiveMember(value: string) {
        return this.props.updateBannerState({
            canSave: true,
            data: {
                ...this.props.data,
                activeUserUpdated: value
            }
        })
    }

    setActiveMemberStatus(e: any) {
        let status = e.target.value as string
        if(1 > status.length || status[status.length-1] === ' ' || status.split('').filter((str) => str === ' ').length === status.length) {
            return
        } else {
            if(status[0] === ' ') {
                let active = true
                for ( let i = 0; active; i++ ) {
                    if(status[i] === ' ') {
                        status = status.slice(i+1, status.length)
                    } else {
                        console.log(i)
                        active = false
                    }
                }
            }

            if(!status) return

            e.target.value = status

            return this.props.updateBannerState({
                canSave: true,
                data: {
                    ...this.props.data,
                    activeUserStatus: status
                }
            })
        }
    }

    setActiveMemberType(type: string) {
        return this.props.updateBannerState({
            canSave: true,
            data: {
                ...this.props.data,
                activeType: type
            }
        })
    }
}