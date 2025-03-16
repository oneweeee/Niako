import { Component } from "react";
import { TextDropdown } from "../../../../../components/Dropdown/TextDropdown";
import { Input } from "../../../../../components/Input/Input";
import { Button } from "../../../../../components/ButtonNew/Button";
import styles from './TimeSettings.module.scss'

import { ReactComponent as IconAddCircle } from '../../../../../assets/svg/AddCircleStroke.svg'
import { ReactComponent as IconClock } from '../../../../../assets/svg/ClockCircle.svg'
import { ReactComponent as IconClose } from '../../../../../assets/svg/CloseStroke.svg'

export class TimeSettings extends Component<{ className: any, data: any, fonts: string[], boostCount: number, updateBannerState: (state: any) => any, resolveImage: (type: string) => any, createKey: (item: any) => any, loadImage: Function, sendError: Function }> {
    render() {
        const keys = Object.keys(this.props.data?.backgrounds || {})
        return (
            <div className={`${styles.settings} ${this.props.className}`} id='settings'>
                <div className={styles.cell}>
                    <div className={styles.title}>
                        <IconClock className={styles.icon} />
                        <p className={styles.text}>Временная зона</p>
                    </div>
                    <TextDropdown placeholder="Выберите зону..." input={true} onClick={this.selectTime.bind(this)} defaultValue={this.props.data.timezone}
                    options={
                        [
                            ...new Array(14).fill(null).map((_, i) => ({ label: `GMT-${i+1}`, value: `GMT-${i+1}` })),
                            { label: `GMT+0`, value: `GMT+0` },
                            ...new Array(12).fill(null).map((_, i) => ({ label: `GMT+${i+1}`, value: `GMT+${i+1}` }))
                        ]
                    }/>
                </div>
                <div className={styles.cell}>
                    <div className={styles.title}>
                        <IconAddCircle className={styles.icon} />
                        <p className={styles.text}>Добавить фон</p>
                    </div>
                    <TextDropdown placeholder="Выберите время..." input={true} onClick={this.addTime.bind(this)} options={
                        new Array(24).fill(null).map((_, i) => (
                            { label: this.getTime(i), value: this.getTime(i) }
                        ))
                    }
                    />
                </div>
                <div className={styles.items}>
                    {
                        keys.length === 0 ? '' : (
                            keys.map((k, i) => {
                                return (
                                    <div className={styles.cell} key={k}>
                                        <div className={styles.title}>
                                            <p className={styles.text}>{keys[i]}</p>
                                            <Button leftIcon={IconClose} styled='outline' size='small' type='normal' onClick={this.deleteBackground.bind(this, k)}/>
                                        </div>
                                        <Input value={this.props.data.backgrounds[k] || ''} placeholder='Вставьте ссылку на фон' onChange={this.onInput.bind(this, k)} />
                                    </div>
                                )
                            })
                        )
                    }
                </div>
            </div>
        )
    }

    onInput(key: string, e: any) {
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
    
        this.props.data.backgrounds[key] = url

        return this.props.updateBannerState({
            canSave: true,
            data: {
                ...this.props.data,
                backgrounds: this.props.data.backgrounds
            }
        })
    }

    selectTime(value: string) {
        return this.props.updateBannerState({
            canSave: true,
            data: {
                ...this.props.data,
                timezone: value
            }
        })
    }

    deleteBackground(key: string) {
        if(!this.props.data?.backgrounds) {
            this.props.data.backgrounds = {}
        }

        delete this.props.data.backgrounds[key]

        return this.props.updateBannerState({
            canSave: true,
            data: {
                ...this.props.data,
                backgrounds: this.props.data.backgrounds
            }
        })
    }

    addTime(value: string) {
        if(!this.props.data?.backgrounds) {
            this.props.data.backgrounds = {}
        }

        const keys = Object.keys(this.props.data.backgrounds)

        if(keys.includes(value)) {
            return this.props.sendError('У Вас уже добавлено такое время')
        }

        this.props.data.backgrounds[value] = ''

        return this.props.updateBannerState({
            canSave: true,
            data: {
                ...this.props.data,
                backgrounds: this.props.data.backgrounds
            }
        })
    }

    private getTime(num: number) {
        if(10 > num) return `0${num}:00`
        return `${num}:00`
    }
}