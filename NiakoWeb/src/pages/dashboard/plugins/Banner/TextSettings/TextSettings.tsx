import { Component } from "react";
import { TextDropdown } from "../../../../../components/Dropdown/TextDropdown";
import styles from './TextSettings.module.scss'

import { ReactComponent as IconAddCircle } from '../../../../../assets/svg/AddCircleStroke.svg'
import { TextContainer } from "./TextContainer/TextContainer";

export class TextSettings extends Component<{ className: any, data: any, fonts: string[], roles: any[], boostCount: number, updateBannerState: (state: any) => any, resolveText: (type: string) => any, createKey: (item: any) => any, sendError: Function }> {
    render() {
        return (
            <div className={`${styles.settings} ${this.props.className}`} id='settings'>
                <div className={styles.cell}>
                    <div className={styles.title}>
                        <IconAddCircle className={styles.icon} />
                        <p className={styles.text}>Добавить текст</p>
                    </div>
                    <TextDropdown placeholder="Выберите тип текста..." input={true} onClick={this.addNewText.bind(this)} options={
                        [
                            { label: 'Голосовая активность', value: 'VoiceOnline' },
                            { label: 'Общее количество участников', value: 'UserCount' },
                            { label: 'Количество участников', value: 'MemberCount' },
                            { label: 'Количество ботов', value: 'BotCount' },
                            { label: 'Время', value: 'Time' },
                            { label: 'Количество бустов', value: 'BoostCount' },
                            { label: 'Уровень буста', value: 'BoostTier' },
                            { label: 'Количество участников с ролью', value: 'RoleMembers' },
                            { label: 'Юзернейм самого активного', value: 'ActiveMemberUsername' },
                            { label: 'Отображаемый ник самого активного', value: 'ActiveMemberNickname' },
                            { label: 'Статус самого активного', value: 'ActiveMemberStatus' },
                            { label: 'Кастомный текст', value: 'Default' }
                        ]
                    }
                    />
                </div>
                <div className={styles.items}>
                    {
                        this.props.data.items.filter((i: any) => i.type === 'Text').map((i: any, index: number) => {
                            return <TextContainer sendError={this.props.sendError} key={index} roles={this.props.roles} data={this.props.data} fonts={this.props.fonts} item={i} resolveText={this.props.resolveText} createKey={this.props.createKey} updateBannerState={this.props.updateBannerState}/>
                        })
                    }
                </div>
            </div>
        )
    }

    addNewText(value: string) {
        let count = 3
        switch(this.props.boostCount) {
            case 0:
            case 1:
                count = 3
                break
            case 2:
            case 3:
            case 4:
                count = 5
                break
            default:
                count = 10
                break
        }

        if(this.props.data.items.filter((i: any) => i.type === 'Text').length >= count) {
            return this.props.sendError('Максимальное кол-во текстов')
        }

        const items = this.props.data.items

        items.unshift({
            text: value,
            disabled: false,
            type: 'Text',
            textType: value,

            color: '#ffffff',
            align: 'left',
            baseline: 'top',
            style: 'regular',
            length: 'None',
            font: 'Montserrat',
            size: 20,
            width: 'None',
            timezone: value === 'Time' ? 'GMT-3' : 'None',
            angle: 'None',
            roleId: '',

            x: 100,
            y: 100,

            createdTimestamp: Date.now()
        })

        return this.props.updateBannerState({
            canSave: true,
            data: {
                ...this.props.data, items
            }
        })
    }
}