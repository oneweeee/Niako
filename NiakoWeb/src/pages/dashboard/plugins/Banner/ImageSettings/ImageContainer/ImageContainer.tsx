import { Component } from "react";
import styles from './ImageContainer.module.scss'
import { SwitcherButtons } from "../../../../../../components/SwitcherButtons/SwitcherButtons";
import { Download } from "../../../../../../components/Download/Download";
import { Buttons } from "../../../../../../components/Buttons/Buttons";
import { Input } from "../../../../../../components/Input/Input";
import { apiUrl } from "../../../../../../config";

import { ReactComponent as IconArrowDown } from '../../../../../../assets/svg/ArrowDown.svg'
import { ReactComponent as IconArrowUp } from '../../../../../../assets/svg/ArrowUp.svg'
import { ReactComponent as IconTrash } from '../../../../../../assets/svg/Trash.svg'
import { ReactComponent as IconEyeClosed } from '../../../../../../assets/svg/EyeClosed.svg'
import { ReactComponent as IconEyeOpened } from '../../../../../../assets/svg/EyeOpened.svg'

export class ImageContainer extends Component<{ key: number, data: any, fonts: string[], sendError: Function, item: any, updateBannerState: (state: any) => any, resolveImage: (type: string) => any, createKey: (item: any) => any, loadImage: Function }, { style?: any, opened: boolean, color: string, mouse: string | null, }> {
    state = { opened: false, color: this.props.item.color, mouse: null, style: null as any }

    render() {
        return (
            <div className={styles.item}>
                <div className={styles.accordion} onClick={this.updateOpened.bind(this)}>
                    <p className={styles.text}>{ this.props.resolveImage(this.props.item.type) }</p>
                    { <IconArrowDown className={`${styles.icon} ${this.state.style || ''}`}/> }
                </div>
                <div className={`${styles.settings} ${this.state.opened ? this.props.item.type === 'Image' ? styles.settings_open_image : styles.settings_open_avatar : ''}`}>
                    <div className={styles.group}>
                        <p className={styles.title}>Общее</p>
                        <div className={styles.cell}>
                            <div className={styles.group}>
                                <div className={styles.setting}>
                                    <div className={styles.main}>
                                        <p className={styles.title}>Ширина</p>
                                        <Input align="center" value={this.props.item.width} onChange={this.inputWidth.bind(this)} maxLength={6}/>
                                    </div>
                                </div>
                                <div className={styles.setting}>
                                    <div className={styles.main}>
                                        <p className={styles.title}>Высота</p>
                                        <Input align="center" value={this.props.item.height} onChange={this.inputHeight.bind(this)} maxLength={6}/>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.group}>
                                <div className={styles.setting}>
                                    <div className={styles.main}>
                                        <p className={styles.title}>Координата X</p>
                                        <Input id={`image-x-${this.props.item.type}-${this.props.item.createdTimestamp}`} align="center" value={this.props.item.x} onChange={this.inputX.bind(this)} maxLength={6}/>
                                    </div>
                                    <Buttons buttons={
                                        [
                                            { value: 'x', strokeIcon: IconArrowUp, onClick: this.onClickX.bind(this), onMouseDown: this.onMouseDown.bind(this), onMouseUp: this.onMouseUp.bind(this) },
                                            { value: 'x', strokeIcon: IconArrowDown, onClick: this.onClickX.bind(this), onMouseDown: this.onMouseDown.bind(this), onMouseUp: this.onMouseUp.bind(this) }
                                        ]
                                    }/>
                                </div>
                                <div className={styles.setting}>
                                    <div className={styles.main}>
                                        <p className={styles.title}>Координата Y</p>
                                        <Input id={`image-y-${this.props.item.type}-${this.props.item.createdTimestamp}`} align="center" value={this.props.item.y} onChange={this.inputY.bind(this)} maxLength={6}/>
                                    </div>
                                    <Buttons buttons={
                                        [
                                            { value: 'y', strokeIcon: IconArrowUp, onClick: this.onClickY.bind(this), onMouseDown: this.onMouseDown.bind(this), onMouseUp: this.onMouseUp.bind(this) },
                                            { value: 'y', strokeIcon: IconArrowDown, onClick: this.onClickY.bind(this), onMouseDown: this.onMouseDown.bind(this), onMouseUp: this.onMouseUp.bind(this) }
                                        ]
                                    }/>
                                </div>
                            </div>
                            {
                            this.props.item.type === 'Image' ?
                            /*<Download id='custom' accept='image/png,image/jpeg' onChange={this.setCustomImage.bind(this)} />*/
                            <Input placeholder='Вставьте ссылку на изображение...' value={this.props.item.url} onChange={this.onInputUrl.bind(this)}/>
                            : ''
                            }
                            <SwitcherButtons
                            currencyButton={this.props.item.shape ? 'shape' : 'noshape'} onClick={this.shaper.bind(this)}
                            buttons={
                                [
                                    { label: 'Закруглить', value: 'shape' },
                                    { label: 'Раскруглить', value: 'noshape' }
                                ]
                            }
                            />
                            {/*<input
                            onChange={(e) => {
                                this.props.item.radius = Number(e.target.value)
                                return this.updateItems()                        
                            }}
                            type="range"
                            min="0"
                            max="100"
                            defaultValue={this.props.item.shape ? '100' : String(this.props.item.radius)}
                            /> */}
                        </div>
                    </div>
                    <div className={styles.group}>
                        <p className={styles.title}>Слои</p>
                        <div className={styles.cell}>
                            <Buttons buttons={
                                [
                                    { value: 'up', strokeIcon: IconArrowUp, onClick: this.updateLayer.bind(this, true) },
                                    { value: 'down', strokeIcon: IconArrowDown, onClick: this.updateLayer.bind(this, false) }
                                ]
                            }/>
                        </div>
                    </div>
                    <div className={styles.group}>
                        <div className={styles.cell}>
                            <Buttons
                            buttons={
                                [
                                    { strokeIcon: IconTrash, onClick: this.deleteItem.bind(this) },
                                    { strokeIcon: (this.props.item.disabled ? IconEyeOpened : IconEyeClosed), onClick: this.updateDisabled.bind(this) },
                                ]
                            }/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    componentDidUpdate(prevProps: Readonly<{ key: number; data: any; fonts: string[]; sendError: Function; item: any; updateBannerState: (state: any) => any; resolveImage: (type: string) => any; createKey: (item: any) => any; loadImage: Function; }>, prevState: Readonly<{ style?: any; opened: boolean; color: string; mouse: string | null; }>, snapshot?: any): void {
        if(JSON.stringify(prevProps.item) !== JSON.stringify(this.props.item)) {
            this.updateOpened()
        }
    }

    updateOpened() {
        const opened = !this.state.opened
        const style = opened ? styles.open_icon : styles.close_icon
        return this.setState({ opened, style })
    }

    updateItems() {
        return this.props.updateBannerState({
            canSave: true,
            data: {
                ...this.props.data,
                items: this.props.data.items
            }
        })
    }

    inputWidth(e: any) {
        const array = (e.target.value as string).split('')

        const end = this.endElement(array), endTwo = this.endElement(array, 2)
        if((isNaN(parseInt(end)) && end !== '.') || (endTwo === '.' && end === '.')) {
            return e.target.value = e.target.value.slice(0, array.length-1)
        }

        const int = parseInt(e.target.value)
        if(isNaN(int) || int > 960 || 0 > int) {
            this.props.sendError('Укажите натуральное значение от 0 до 960')
            return e.target.value = e.target.value.slice(0, array.length-1)
        }

        this.props.item.width = int

        return this.updateItems()
    }

    inputHeight(e: any) {
        const array = (e.target.value as string).split('')

        const end = this.endElement(array), endTwo = this.endElement(array, 2)
        if((isNaN(parseInt(end)) && end !== '.') || (endTwo === '.' && end === '.')) {
            this.props.sendError('Укажите натуральное значение от 0 до 540')
            return e.target.value = e.target.value.slice(0, array.length-1)
        }

        const int = parseInt(e.target.value)
        if(isNaN(int) || int > 540 || 0 > int) {
            return e.target.value = e.target.value.slice(0, array.length-1)
        }

        this.props.item.height = int

        return this.updateItems()
    }

    inputX(e: any) {
        const array = (e.target.value as string).split('')

        const end = this.endElement(array), endTwo = this.endElement(array, 2)
        if((isNaN(parseInt(end)) && end !== '.') || (endTwo === '.' && end === '.')) {
            return e.target.value = e.target.value.slice(0, array.length-1)
        }

        const int = parseInt(e.target.value)
        if(isNaN(int) || int > 960 || 0 > int) {
            this.props.sendError('Укажите натуральное значение от 0 до 960')
            return e.target.value = e.target.value.slice(0, array.length-1)
        }

        this.props.item.x = int

        return this.updateItems()
    }

    inputY(e: any) {
        const array = (e.target.value as string).split('')

        const end = this.endElement(array), endTwo = this.endElement(array, 2)
        if((isNaN(parseInt(end)) && end !== '.') || (endTwo === '.' && end === '.')) {
            return e.target.value = e.target.value.slice(0, array.length-1)
        }

        const int = Number(e.target.value)
        if(isNaN(int) || int > 540 || 0 > int) {
            this.props.sendError('Укажите натуральное значение от 0 до 540')
            return e.target.value = e.target.value.slice(0, array.length-1)
        }

        this.props.item.y = int

        return this.updateItems()
    }

    async setCustomImage(e: any) {
        let file = e.target.files[0]
        if(!file) return

        if(file.size > 1024 * 1024 * 2) {
            return this.props.sendError('Размер файла привышает 2МБ')
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

        this.props.item.url = response.answer
        this.props.item.image = await this.props.loadImage(response.answer)

        return this.updateItems()
    }

    shaper(shape: string) {
        this.props.item.shape = shape === 'shape' ? true : false
        this.props.item.radius = shape === 'shape' ? 100 : 0
        return this.updateItems()
    }

    async onInputUrl(e: any) {
        const url = e.target.value as string
        if(!url.startsWith('http') || 4 > url.split('/').length) {
            return this.props.sendError('Недействительная ссылка на фон')
        }

        const allow = [ 'jpeg', 'jpg', 'png' ]
        if(!allow.some((str) => url.includes(`.${str}`))) {
            return this.props.sendError('Недопустимое расширение файла')
        }

        await this.props.loadImage(url).then((image: any) => {
            this.props.item.url = url
            this.props.item.image = image
            return this.updateItems()
        }).catch(() => {})
    }

    updateLayer(state: boolean) {
        const index = this.props.data.items.findIndex((i: any) => this.props.createKey(i) === this.props.createKey(this.props.item))
        if(index === -1) return

        if(state) {
            this.props.data.items.splice(index, 1)
            this.props.data.items.push(this.props.item)
        } else {
            this.props.data.items.splice(index, 1)
            this.props.data.items.unshift(this.props.item)
        }

        return this.updateItems()
    }

    deleteItem() {
        const index = this.props.data.items.findIndex((i: any) => this.props.createKey(i) === this.props.createKey(this.props.item))
        if(index === -1) return

        this.props.data.items.splice(index, 1)
        return this.updateItems()
    }

    updateDisabled() {
        this.props.item.disabled = !this.props.item.disabled
        return this.updateItems()
    }

    onClickX(e: any) {
        const state = e.target.id.split('.')[1] as '0' | '1'
        
        const get = document.getElementById(`image-x-${this.props.item.type}-${this.props.item.createdTimestamp}`) as any
        if(!get) return

        const value = (Number(get.value) + (state === '0' ? +1 : state === '1' ? -1 : 0))
        if(isNaN(value) || value > 960 || 0 > value) {
            this.props.sendError('Координата X от 0 до 960')
            return get.value 
        }

        this.props.item.x = value
        get.value = String(value)
        return this.updateItems()
    }

    onClickY(e: any) {
        const state = e.target.id.split('.')[1] as '0' | '1'
        
        const get = document.getElementById(`image-y-${this.props.item.type}-${this.props.item.createdTimestamp}`) as any
        if(!get) return

        const value = (Number(get.value) + (state === '0' ? +1 : state === '1' ? -1 : 0))
        if(isNaN(value) || value > 540 || 0 > value) {
            this.props.sendError('Координата Y от 0 до 540')
            return get.value 
        }
        
        this.props.item.y = value
        get.value = String(value)
        return this.updateItems()
    }

    onMouseDown(e: any) {
        const target = e.target.id.split('.')[0]
        const state = e.target.id.split('.')[1] as '0' | '1'
        
        const get = document.getElementById(`image-${target}-${this.props.item.type}-${this.props.item.createdTimestamp}`) as any
        if(!get) return

        this.setState({ mouse: target })

        const interval = setInterval(() => {
            if(this.state.mouse === target) {
                const value = (Number(get.value) + (state === '0' ? +1 : state === '1' ? -1 : 0))

                switch(target) {
                    case 'x':
                        if(isNaN(value) || value > 960 || 0 > value) {
                            this.props.sendError('Координата Y от 0 до 540')
                            return get.value 
                        }
                
                        this.props.item.x = value
                        get.value = String(value)
                        this.updateItems()
                        break
                    case 'y':
                        if(isNaN(value) || value > 540 || 0 > value) {
                            this.props.sendError('Координата Y от 0 до 540')
                            return get.value 
                        }
                
                        this.props.item.y = value
                        get.value = String(value)
                        this.updateItems()
                        break
                }
            } else {
                clearInterval(interval)
            }
        }, 100)
    }

    onMouseUp() {
        return this.setState({ mouse: null })
    }

    private endElement<T>(array: T[], size = 1): T {
        return array[array.length-size]
    }
}