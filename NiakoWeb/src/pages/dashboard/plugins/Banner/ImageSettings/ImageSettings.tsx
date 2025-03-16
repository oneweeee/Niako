import { Component } from "react";
import { TextDropdown } from "../../../../../components/Dropdown/TextDropdown";
import styles from './ImageSettings.module.scss'

import { ReactComponent as IconAddCircle } from '../../../../../assets/svg/AddCircleStroke.svg'
import { ImageContainer } from "./ImageContainer/ImageContainer";

export class ImageSettings extends Component<{ className: any, data: any, fonts: string[], boostCount: number, updateBannerState: (state: any) => any, resolveImage: (type: string) => any, createKey: (item: any) => any, loadImage: Function, sendError: Function }> {
    render() {
        return (
            <div className={`${styles.settings} ${this.props.className}`} id='settings'>
                <div className={styles.cell}>
                    <div className={styles.title}>
                        <IconAddCircle className={styles.icon} />
                        <p className={styles.text}>Добавить изображение</p>
                    </div>
                    <TextDropdown placeholder="Выберите тип изображения..." onClick={this.addNewImage.bind(this)} options={
                        [
                            { label: 'Кастомное изображение', value: 'Image' },
                            { label: 'Аватарка самого активного', value: 'ActiveMemberAvatar' }
                        ]
                    }
                    />
                </div>
                <div className={styles.items}>
                    {
                        this.props.data.items.filter((i: any) => i.type !== 'Text').reverse().map((i: any, index: number) => {
                            return <ImageContainer sendError={this.props.sendError} key={index} data={this.props.data} fonts={this.props.fonts} item={i} resolveImage={this.props.resolveImage} createKey={this.props.createKey} updateBannerState={this.props.updateBannerState} loadImage={this.props.loadImage}/>
                        })
                    }
                </div>
            </div>
        )
    }

    async addNewImage(value: string) {
        let count = 3
        switch(this.props.boostCount) {
            case 0:
            case 1:
                count = 1
                break
            case 2:
            case 3:
            case 4:
                count = 2
                break
            default:
                count = 3
                break
        }

        if(this.props.data.items.filter((i: any) => i.type !== 'Text').length >= count) {
            return this.props.sendError('Максимальное кол-во изображений')
        }

        const user = JSON.parse(localStorage.getItem('niako') || '{}')?.currentUser
        const items = this.props.data.items

        items.push({
            name: value,
            url: '',
            disabled: false,
            type: value,

            radius: 100,
            width: 100,
            height: 100,
            shape: false,

            x: 100,
            y: 100,
            image: value === 'ActiveMemberAvatar' && user && user?.avatar ? (
                await this.props.loadImage(
                    `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=4096`
                )
            ) : null,

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