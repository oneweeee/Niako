import { Component } from "react";
import styles from './TextContainer.module.scss'

import { ReactComponent as IconArrowDown } from '../../../../../../assets/svg/ArrowDown.svg'
import { ReactComponent as IconArrowUp } from '../../../../../../assets/svg/ArrowUp.svg'
import { ReactComponent as IconAlignBottom } from '../../../../../../assets/svg/AlignBottom.svg'
import { ReactComponent as IconAlignMiddle } from '../../../../../../assets/svg/AlignMiddle.svg'
import { ReactComponent as IconAlignTop } from '../../../../../../assets/svg/AlignTop.svg'
import { ReactComponent as IconAlignLeft } from '../../../../../../assets/svg/AlignLeft.svg'
import { ReactComponent as IconAlignCenter } from '../../../../../../assets/svg/AlignCenter.svg'
import { ReactComponent as IconAlignRight } from '../../../../../../assets/svg/AlignRight.svg'
import { ReactComponent as IconTrash } from '../../../../../../assets/svg/Trash.svg'
import { ReactComponent as IconEyeClosed } from '../../../../../../assets/svg/EyeClosed.svg'
import { ReactComponent as IconEyeOpened } from '../../../../../../assets/svg/EyeOpened.svg'
import { Input } from "../../../../../../components/Input/Input";
import { TextDropdown } from "../../../../../../components/Dropdown/TextDropdown";
import { Buttons } from "../../../../../../components/Buttons/Buttons";
import { RoleDropdown } from "../../../../../../components/Dropdown/RoleDropdown";
import { Switcher } from "../../../../../../components/Switcher/Switcher";

export class TextContainer extends Component<{ key: number, data: any, roles: any[], fonts: string[], item: any, updateBannerState: (state: any) => any, resolveText: (type: string) => any, createKey: (item: any) => any, sendError: any }, { style?: any, opened: boolean, color: string, mouse: string | null }> {
    state = { opened: false, color: this.props.item.color, mouse: null, style: null as any }

    render() {
        return (
            <div className={styles.item}>
                <div className={styles.accordion} onClick={this.updateOpened.bind(this)}>
                    <p className={styles.text}>{ this.props.resolveText(this.props.item.textType).name }</p>
                    { <IconArrowDown className={`${styles.icon} ${this.state.style || ''}`}/> }
                </div>
                <div className={`${styles.settings} ${this.state.opened ? this.props.item.textType === 'RoleMembers' ? styles.settings_open_custom_new : ['VoiceOnline', 'UserCount', 'MemberCount', 'BotCount', 'BoostCount', 'Default', 'Time'].includes(this.props.item.textType) ? styles.settings_open_custom : styles.settings_open_text : ''}`}>
                    <div className={styles.group}>
                        <p className={styles.title}>Общее</p>
                        <div className={styles.cell}>
                            <div className={styles.group}>
                                <div className={styles.setting}>
                                    <div className={styles.main}>
                                        <p className={styles.title}>Ширина</p>
                                        <Input align="center" value={this.props.item.width === 'None' ? '0' : this.props.item.width} onChange={this.inputWidth.bind(this)} maxLength={6}/>
                                    </div>
                                </div>
                                <div className={styles.setting}>
                                    <div className={styles.main}>
                                        <p className={styles.title}>Вращение</p>
                                        <Input align="center" value={this.props.item.angle === 'None' ? '0' : this.props.item.angle} onChange={this.inputAngle.bind(this)} maxLength={4}/>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.group}>
                                <div className={styles.setting}>
                                    <div className={styles.main}>
                                        <p className={styles.title}>Координата X</p>
                                        <Input id={`text-x-${this.props.createKey(this.props.item)}`} align="center" value={this.props.item.x} onChange={this.inputX.bind(this)} maxLength={6}/>
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
                                        <Input id={`text-y-${this.props.createKey(this.props.item)}`} align="center" value={this.props.item.y} onChange={this.inputY.bind(this)} maxLength={6}/>
                                    </div>
                                    <Buttons buttons={
                                        [
                                            { value: 'y', strokeIcon: IconArrowUp, onClick: this.onClickY.bind(this), onMouseDown: this.onMouseDown.bind(this), onMouseUp: this.onMouseUp.bind(this) },
                                            { value: 'y', strokeIcon: IconArrowDown, onClick: this.onClickY.bind(this), onMouseDown: this.onMouseDown.bind(this), onMouseUp: this.onMouseUp.bind(this) }
                                        ]
                                    }/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.group}>
                        <p className={styles.title}>Текст</p>
                        <div className={styles.cell}>
                            <div className={styles.group}>
                                <div className={styles.setting}>
                                    <div className={styles.main}>
                                        <p className={styles.title}>Размер</p>
                                        <Input align="center" value={this.props.item.size} onChange={this.inputSize.bind(this)} maxLength={2} />
                                    </div>
                                </div>
                                <div className={styles.setting}>
                                    <div className={styles.main}>
                                        <p className={styles.title}>Цвет</p>
                                        <div className={styles.color}>
                                            <input id={`colorPicker-${this.props.createKey(this.props.item)}`} className={styles.picker} value={this.state.color} onChange={this.pickerColor.bind(this)} type='color' style={{ background: this.props.item.color }} />
                                            <Input id={`color-${this.props.createKey(this.props.item)}`} align="center" value={this.state.color} onChange={this.inputColor.bind(this)} maxLength={7} minLength={7} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.group}>
                                <div className={styles.setting}>
                                    <div className={styles.main}>
                                        <p className={styles.title}>Шрифт</p>
                                        <TextDropdown placeholder="Выберите шрифт..." input={true} onClick={this.selectFont.bind(this)} defaultValue={this.props.item.font}
                                        options={
                                            this.props.fonts.map(
                                                (font) => (
                                                    {
                                                        label: font.split('.')[0].split('-').join(' '),
                                                        value: font.split('.')[0].split('-').join(' '),
                                                        font: font.split('.')[0].split('-').join(' ')
                                                    }
                                                )
                                            )
                                        }/>
                                    </div>
                                </div>
                            </div>
                            {
                                [
                                    'VoiceOnline', 'UserCount', 'MemberCount',
                                    'BotCount', 'BoostCount', 'RoleMembers'
                                ].includes(this.props.item.textType) ? (
                                    <div className={styles.group}>
                                        <div className={styles.setting}>
                                            <div className={styles.main} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <p className={styles.title}>Разделить цифры</p>
                                                <Switcher state={Boolean(this.props.item?.isRazbit)} onChange={this.updateRazbit.bind(this)} />
                                            </div>
                                        </div>
                                    </div>
                                ) : ''
                            }
                            {
                                this.props.item.textType === 'Time' ? (
                                    <div className={styles.group}>
                                        <div className={styles.setting}>
                                            <div className={styles.main}>
                                                <p className={styles.title}>Время</p>
                                                <TextDropdown placeholder="Выберите зону..." input={true} onClick={this.selectTime.bind(this)} defaultValue={this.props.item.timezone}
                                                options={
                                                    [
                                                        ...new Array(14).fill(null).map((_, i) => ({ label: `GMT-${i+1}`, value: `GMT-${i+1}` })),
                                                        { label: `GMT+0`, value: `GMT+0` },
                                                        ...new Array(12).fill(null).map((_, i) => ({ label: `GMT+${i+1}`, value: `GMT+${i+1}` }))
                                                    ]
                                                }/>
                                            </div>
                                        </div>
                                    </div>
                                ) : ''
                            }
                            {
                                this.props.item.textType === 'Default' ? (
                                    <div className={styles.group}>
                                        <div className={styles.setting}>
                                            <div className={styles.main}>
                                                <p className={styles.title}>Текст</p>
                                                <Input onChange={this.inputCustomText.bind(this)} value={this.props.item.text} minLength={1} maxLength={32}/>
                                            </div>
                                        </div>
                                    </div>
                                    
                                ) : ''
                            }
                            {
                                this.props.item.textType === 'RoleMembers' ? (
                                    <div className={styles.group}>
                                        <div className={styles.setting}>
                                            <div className={styles.main}>
                                                <p className={styles.title}>Роль</p>
                                                <RoleDropdown placeholder={'Выберите роль сервера...'} 
                                                defaultValues={this.props.item?.roleId ? [ this.props.item.roleId ] : []}
                                                maxCount={1} input={true} sendError={this.props.sendError} onClick={this.selectRoleId.bind(this)}
                                                options={
                                                    (this.props.roles as any[]).filter((r) => {
                                                        if(r?.tags && Object.keys(r.tags).length > 0) {
                                                            return false
                                                        }
                                                        return true
                                                    }).sort((a, b) => b.position - a.position).map((r) => ({ label: r.name, value: r.id, default: (this.props.item?.roleId && this.props.item.roleId === r.id), color: r.color.toString(16) }))
                                                }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                ) : ''
                            }
                            <div className={styles.group}>
                                <div className={styles.setting}>
                                    <div className={styles.main}>
                                        <p className={styles.title}>Выравнивание</p>
                                        <div className={styles.buttons_group}>
                                            <Buttons
                                            buttons={
                                                [
                                                    { strokeIcon: IconAlignLeft, currency: this.props.item.align === 'left', onClick: this.setAlign.bind(this, 'left') },
                                                    { strokeIcon: IconAlignCenter, currency: this.props.item.align === 'center', onClick: this.setAlign.bind(this, 'center') },
                                                    { strokeIcon: IconAlignRight, currency: this.props.item.align === 'right', onClick: this.setAlign.bind(this, 'right') }
                                                ]
                                            }/>
                                            <Buttons
                                            buttons={
                                                [
                                                    { strokeIcon: IconAlignTop, currency: this.props.item.baseline === 'top', onClick: this.setBaseline.bind(this, 'top') },
                                                    { strokeIcon: IconAlignMiddle, currency: this.props.item.baseline === 'middle', onClick: this.setBaseline.bind(this, 'middle') },
                                                    { strokeIcon: IconAlignBottom, currency: this.props.item.baseline === 'bottom', onClick: this.setBaseline.bind(this, 'bottom') }
                                                ]
                                            }/>
                                        </div>
                                    </div>
                                </div>
                            </div>
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

    updateOpened() {
        const opened = !this.state.opened
        const style = opened ? styles.open_icon : styles.close_icon
        return this.setState({ opened, style })
    }

    updateItems(data?: any) {
        //const items = Object.assign(this.props.data).items as any[]
        //const index = items.findIndex((i: any) => this.props.createKey(i) === this.props.createKey(this.props.item))
        //items.splice(index, 1, this.props.item)

        return this.props.updateBannerState({
            canSave: true,
            data: {
                ...(data || this.props.data)
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

        this.props.item.width = int === 0 ? 'None' : int

        return this.updateItems()
    }

    inputAngle(e: any) {
        const array = (e.target.value as string).split('')

        const end = this.endElement(array), endTwo = this.endElement(array, 2)
        if((isNaN(parseInt(end)) && end !== '.') || (endTwo === '.' && end === '.')) {
            return e.target.value = e.target.value.slice(0, array.length-1)
        }

        const int = parseInt(e.target.value)
        if(isNaN(int) || int > 360 || -360 > int) {
            this.props.sendError('Укажите натуральное значение от -360 до 360')
            return e.target.value = e.target.value.slice(0, array.length-1)
        }

        this.props.item.angle = int === 0 ? 'None' : int

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

    inputSize(e: any) {
        const array = (e.target.value as string).split('')

        const end = this.endElement(array), endTwo = this.endElement(array, 2)
        if((isNaN(parseInt(end)) && end !== '.') || (endTwo === '.' && end === '.')) {
            return e.target.value = e.target.value.slice(0, array.length-1)
        }

        const int = Number(e.target.value)
        if(isNaN(int) || int > 100 || 1 > int) {
            this.props.sendError('Укажите натуральное значение от 1 до 100')
            return e.target.value = e.target.value.slice(0, array.length-1)
        }

        this.props.item.size = int

        return this.updateItems()
    }

    pickerColor(e: any) {
        const color = e.target.value as string
        this.props.item.color = color
        this.setState({ color: color })
        return this.updateItems()
    }

    inputColor(e: any) {
        if(e.target.length !== 7 && !e.target.value.startsWith('#')) {
            return this.props.sendError('Укажите #HEX код цвета')
        }
        this.props.item.color = e.target.value
        this.setState({ color: e.target.value })
        return this.updateItems()
    }
    
    selectFont(value: string) {
        this.props.item.font = value
        return this.updateItems()
    }

    updateRazbit() {
        this.props.item.isRazbit = !this.props.item.isRazbit
        return this.updateItems()
    }

    selectRoleId(values: string[]) {
        this.props.item.roleId = values[0]
        return this.updateItems()
    }

    selectTime(value: string) {
        this.props.item.timezone = value
        return this.updateItems()
    }

    inputCustomText(e: any) {
        const value =  e.target.value
        if(1 > value.length || value[value.length-1] === ' ') {
            return
        }
        
        this.props.item.text = e.target.value
        return this.props.updateBannerState({
            data: {
                ...this.props.data,
                items: this.props.data.items
            }
        })
    }

    setAlign(align: string) {
        this.props.item.align = align
        return this.updateItems()
    }

    setBaseline(baseline: string) {
        this.props.item.baseline = baseline
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
        
        const get = document.getElementById(`text-x-${this.props.createKey(this.props.item)}`) as any
        if(!get) return

        const value = (Number(get.value) + (state === '0' ? +1 : state === '1' ? -1 : 0))
        if(isNaN(value) || value > 960 || 0 > value) {
            return get.value 
        }

        this.props.item.x = value
        get.value = String(value)
        return this.updateItems()
    }

    onClickY(e: any) {
        const state = e.target.id.split('.')[1] as '0' | '1'
        
        const get = document.getElementById(`text-y-${this.props.createKey(this.props.item)}`) as any
        if(!get) return

        const value = (Number(get.value) + (state === '0' ? +1 : state === '1' ? -1 : 0))
        if(isNaN(value) || value > 540 || 0 > value) {
            return get.value 
        }
        
        this.props.item.y = value
        get.value = String(value)
        return this.updateItems()
    }

    onMouseDown(e: any) {
        const target = e.target.id.split('.')[0]
        const state = e.target.id.split('.')[1] as '0' | '1'
        
        const get = document.getElementById(`text-${target}-${this.props.createKey(this.props.item)}`) as any
        if(!get) return

        this.setState({ mouse: target })

        const interval = setInterval(() => {
            if(this.state.mouse === target) {
                const value = (Number(get.value) + (state === '0' ? +1 : state === '1' ? -1 : 0))

                switch(target) {
                    case 'x':
                        if(isNaN(value) || value > 960 || 0 > value) {
                            return get.value 
                        }
                
                        this.props.item.x = value
                        get.value = String(value)
                        this.updateItems()
                        break
                    case 'y':
                        if(isNaN(value) || value > 540 || 0 > value) {
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
        }, 150)
    }

    onMouseUp() {
        return this.setState({ mouse: null })
    }

    private endElement<T>(array: T[], size = 1): T {
        return array[array.length-size]
    }
}