import { Component } from "react";
import styles from './MessageSettings.module.scss'
import { TextArea } from "../../../../../components/TextArea/TextArea";
import { Input } from "../../../../../components/Input/Input";
import { Switcher } from "../../../../../components/Switcher/Switcher";

import { ReactComponent as IconAddCircle } from '../../../../../assets/svg/AddCircleStroke.svg'
import { ReactComponent as IconArrowDown } from '../../../../../assets/svg/ArrowDown.svg'
import { ReactComponent as IconTrash } from '../../../../../assets/svg/Trash.svg'

export class MessageSettings extends Component<{ className: any, data: any, updateState: any, sendError: any, discord: any }, { opens: string[], accordions: { [ key: string ]: any } }> {
    state = { opens: [] as string[], accordions: {} as any }

    render() {
        const parse = JSON.parse(this.props.data.embed)

        return (
            <div className={`${styles.settings} ${this.props.className}`} id='settings'>
                <div className={styles.author}>
                    <div className={styles.accordion} onClick={this.onClickAccrodion.bind(this, 'Author')}>
                        <p className={styles.title}>Author</p>
                        <IconArrowDown className={`${styles.icon} ${this.state.accordions['Author']}`} />
                    </div>
                    {
                        this.state.opens.includes('Author') ? (
                            <div className={styles.row}>
                                <div className={styles.cell}>
                                    <p className={styles.text}>Name</p>
                                    <Input onChange={this.inputAuthorName.bind(this)} placeholder='Name' value={parse?.author?.name || ''} maxLength={256} />
                                </div>
                                <div className={styles.cell}>
                                    <p className={styles.text}>Author Icon Url</p>
                                    <Input onChange={this.inputAuthorIconUrl.bind(this)} placeholder='Icon Url' value={parse?.author?.icon_url || ''} />
                                </div>
                                <div className={styles.cell}>
                                    <p className={styles.text}>Author Url</p>
                                    <Input onChange={this.inputAuthorUrl.bind(this)} placeholder='Url' value={parse?.author?.url || ''} />
                                </div>
                            </div>
                        ) : ''
                    }
                </div>
                <div className={styles.body}>
                    <div className={styles.accordion} onClick={this.onClickAccrodion.bind(this, 'Body')}>
                        <p className={styles.title}>Body</p>
                        <IconArrowDown className={`${styles.icon} ${this.state.accordions['Body']}`} />
                    </div>
                    {
                        this.state.opens.includes('Body') ? (
                            <div className={`${styles.row} ${styles.column}`}>
                                <div className={styles.group}>
                                    <div className={`${styles.cell} ${styles.width}`}>
                                        <p className={styles.text}>Title</p>
                                        <Input onChange={this.inputTitle.bind(this)} placeholder='Title' value={parse?.title || ''} maxLength={256} />
                                    </div>
                                    <div className={`${styles.cell} ${styles.width}`}>
                                        <p className={styles.text}>Description</p>
                                        <TextArea onChange={this.inputDescription.bind(this)} content={parse?.description || ''} maxLength={4096} />
                                    </div>
                                </div>
                                <div className={`${styles.cell} ${styles.width}`}>
                                    <p className={styles.text}>Url</p>
                                    <Input onChange={this.inputUrl.bind(this)} placeholder='Url' value={parse?.url || ''} />
                                </div>
                                <div className={`${styles.cell} ${styles.width}`}>
                                    <p className={styles.text}>Color</p>
                                    <div className={styles.color_picker}>
                                        <input id='colorPicker' className={styles.picker} value={parse?.color ? '#' + this.convertToDiscordColor(parse?.color) : ''} onChange={this.pickerColor.bind(this)} type='color' style={{ background: parse?.color ? '#' + parseInt(parse?.color).toString(16) : undefined }} />
                                        <Input id='colorInput' onChange={this.inputColor.bind(this)} value={parse?.color ? '#' + this.convertToDiscordColor(parse?.color) : ''} maxLength={7} minLength={7} />
                                    </div>
                                </div>
                            </div>
                        ) : ''
                    }
                </div>
                <div className={styles.images}>
                    <div className={styles.accordion} onClick={this.onClickAccrodion.bind(this, 'Images')}>
                        <p className={styles.title}>Images</p>
                        <IconArrowDown className={`${styles.icon} ${this.state.accordions['Images']}`} />
                    </div>
                    {
                        this.state.opens.includes('Images') ? (
                            <div className={styles.row}>
                                <div className={styles.cell}>
                                    <p className={styles.text}>Image</p>
                                    <Input onChange={this.inputImageUrl.bind(this)} placeholder='Image' value={parse?.image?.url || ''} />
                                </div>
                                <div className={styles.cell}>
                                    <p className={styles.text}>Thumbnail</p>
                                    <Input onChange={this.inputThumbnailUrl.bind(this)} placeholder='Thumbnail' value={parse?.thumbnail?.url || ''} />
                                </div>
                            </div>
                        ) : ''
                    }
                </div>
                <div className={styles.footer}>
                    <div className={styles.accordion} onClick={this.onClickAccrodion.bind(this, 'Footer')}>
                        <p className={styles.title}>Footer</p>
                        <IconArrowDown className={`${styles.icon} ${this.state.accordions['Footer']}`} />
                    </div>
                    {
                        this.state.opens.includes('Footer') ? (
                            <div className={styles.row}>
                                <div className={styles.cell}>
                                    <p className={styles.text}>Footer Text</p>
                                    <Input onChange={this.inputFooterText.bind(this)} placeholder='Footer' value={parse?.footer?.text || ''} maxLength={2048} />
                                </div>
                                <div className={styles.cell}>
                                    <p className={styles.text}>Footer Icon Url</p>
                                    <Input onChange={this.inputFooterIconUrl.bind(this)} placeholder='Icon Url' value={parse?.footer?.icon_url || ''} />
                                </div>
                                {
                                    /* <div className={styles.cell}>
                                        <p className={styles.text}>Timestamp</p>
                                        <Input onChange={this.inputImageUrl.bind(this)} placeholder='03.01.1990' value={parse?.images?.url || ''} />
                                    </div> */
                                }
                            </div>
                        ) : ''
                    }
                </div>
                <div className={styles.fields}>
                    <div className={styles.accordion} onClick={this.onClickAccrodion.bind(this, 'Fields')}>
                        <p className={styles.title}>Fields {(parse?.fields || []).length}/25</p>
                        <div className={styles.rowbutton}>
                            <div onClick={this.clickAddNewField.bind(this)} className={styles.button}>
                                <IconAddCircle className={styles.icon} />
                            </div>
                            <IconArrowDown className={`${styles.icon} ${this.state.accordions['Fields']}`} />
                        </div>
                    </div>
                    {
                        this.state.opens.includes('Fields') && (parse?.fields || []).length > 0 ? (
                            <div className={styles.row}>
                                {
                                    parse.fields.map((f: { name?: string, value?: string, inline: boolean }, i: number) => {
                                        return (
                                            <div key={i} className={styles.field}>
                                                <div className={styles.accordion} onClick={this.onClickAccrodion.bind(this, `field.${i}`)}>
                                                    <p className={styles.title}>Field {i+1}</p>
                                                    <div className={styles.rowbutton}>
                                                        <div id={`field.${i}`} className={styles.button} onClick={this.clickDeleteField.bind(this)}>
                                                            <IconTrash id={`field.${i}`} className={styles.icon}/>
                                                        </div>
                                                        <IconArrowDown className={`${styles.icon} ${this.state.accordions[`field.${i}`]}`} />
                                                    </div>
                                                </div>
                                                {
                                                    this.state.opens.includes(`field.${i}`) ? (
                                                        <div className={styles.manage_field}>
                                                            <div className={styles.row}>
                                                                <div className={styles.cell}>
                                                                    <p className={styles.text}>Name</p>
                                                                    <Input id={`field.${i}`} onChange={this.inputFieldName.bind(this)} placeholder='Name' value={f?.name || ''} />
                                                                </div>
                                                            </div>
                                                            <div className={styles.row}>
                                                                <div className={styles.cell}>
                                                                    <p className={styles.text}>Value</p>
                                                                    <TextArea id={`field.${i}`} onChange={this.inputFieldValue.bind(this)} content={f?.value || ''} maxLength={1024} />
                                                                </div>
                                                            </div>
                                                            <div className={`${styles.row} ${styles.rowswitch}`}>
                                                                <div className={styles.blockswitch}>
                                                                    <p className={styles.text}>Inline</p>
                                                                    <Switcher id={`field.${i}`} onChange={this.switchFieldInline.bind(this)} state={f?.inline} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : ''
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        ) : ''
                    }
                </div>
            </div>
        )
    }

    onClickAccrodion(type: string) {
        const accordions = structuredClone(this.state.accordions)
        if(this.state.opens.includes(type)) {
            this.state.opens.splice(this.state.opens.indexOf(type), 1)
            accordions[type] = styles.close_icon
            return this.setState({ opens: this.state.opens, accordions })
        } else {
            this.state.opens.push(type)
            accordions[type] = styles.open_icon
            return this.setState({ opens: this.state.opens, accordions })
        }
    }

    inputAuthorName(e: any) {
        const name = e.target.value as string
        if(name[name.length-1] === ' ') return

        const obj = JSON.parse(this.props.data.embed)
        if(!obj?.author) {
            obj.author = { name: undefined }
        }

        if(name.length > 256) return

        obj.author.name = name

        if(obj.author.name === '' && !obj.author?.icon_url) {
            delete obj.author
        }

        return this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                embed: JSON.stringify(obj)
            }
        })
    }

    inputAuthorIconUrl(e: any) {
        const url = e.target.value as string
        if(url[url.length-1] === ' ') return

        const obj = JSON.parse(this.props.data.embed)
        if(!obj?.author) {
            obj.author = { icon_url: undefined }
        }

        if(!url.startsWith('http')) return

        obj.author.icon_url = url

        if(!obj.author.icon_url && !obj.author?.name) {
            delete obj.author
        }

        return this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                embed: JSON.stringify(obj)
            }
        })
    }

    inputAuthorUrl(e: any) {
        const url = e.target.value as string
        if(url[url.length-1] === ' ') return

        const obj = JSON.parse(this.props.data.embed)
        if(!obj?.author) {
            obj.author = { url: undefined }
        }

        if(!url.startsWith('http')) return

        obj.author.url = url

        if(!obj.author.icon_url && !obj.author?.name && !obj.author?.url) {
            delete obj.author
        }

        return this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                embed: JSON.stringify(obj)
            }
        })
    }

    inputTitle(e: any) {
        const name = e.target.value as string
        if(name[name.length-1] === ' ') return

        const obj = JSON.parse(this.props.data.embed)
        if(!obj?.title) {
            obj.title = ''
        }

        if(name.length > 256) return

        obj.title = name

        if(!obj.title) {
            delete obj.title
        }

        return this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                embed: JSON.stringify(obj)
            }
        })
    }

    inputDescription(e: any) {
        const name = e.target.value as string
        if(name[name.length-1] === ' ') return

        const obj = JSON.parse(this.props.data.embed)
        if(!obj?.description) {
            obj.description = ''
        }

        if(name.length > 4096) return

        obj.description = name

        if(!obj.description) {
            delete obj.description
        }

        return this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                embed: JSON.stringify(obj)
            }
        })
    }

    inputUrl(e: any) {
        const url = e.target.value as string
        if(url[url.length-1] === ' ') return

        const obj = JSON.parse(this.props.data.embed)
        if(!obj?.url) {
            obj.url = ''
        }

        obj.url = url

        if(!obj.url || !obj.url.startsWith('http')) {
            delete obj.url
        }

        return this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                embed: JSON.stringify(obj)
            }
        })
    }

    pickerColor(e: any) {
        const color = e.target.value as string
        const el = document.getElementById('colorInput') as any
        if(el) {
            el.value = color
        }

        const obj = JSON.parse(this.props.data.embed)
        obj.color = !color.startsWith('#') && color.length !== 7 ? this.convertColor('010101') : this.convertColor(color)

        if(!obj?.color) {
            delete obj.color
        }

        return this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                embed: JSON.stringify(obj)
            }
        })
    }

    inputColor(e: any) {
        const color = e.target.value as string
        if(color.length !== 7 && !color.startsWith('#')) {
            return this.props.sendError('Укажите #HEX код цвета')
        }

        if(color.split('').some((w) => !this.isAllowWord(w) && w !== '#')) {
            return this.props.sendError('Некорректные символы в дефолтном цвете')
        }

        const obj = JSON.parse(this.props.data.embed)
        obj.color = !color.startsWith('#') && color.length !== 7 ? this.convertColor('010101') : this.convertColor(color)

        if(!obj?.color) {
            delete obj.color
        }

        return this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                embed: JSON.stringify(obj)
            }
        })
    }

    inputImageUrl(e: any) {
        const url = e.target.value as string
        if(url[url.length-1] === ' ') return

        const obj = JSON.parse(this.props.data.embed)
        if(!obj?.image) {
            obj.image = { url: '' }
        }

        obj.image.url = url

        if(!obj.image.url || !obj.image.url.startsWith('http')) {
            delete obj.image
        }

        return this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                embed: JSON.stringify(obj)
            }
        })
    }

    inputThumbnailUrl(e: any) {
        const url = e.target.value as string
        if(url[url.length-1] === ' ') return

        const obj = JSON.parse(this.props.data.embed)
        if(!obj?.thumbnail) {
            obj.thumbnail = { url: '' }
        }

        obj.thumbnail.url = url

        if(!obj.thumbnail.url || !obj.thumbnail.url.startsWith('http')) {
            delete obj.thumbnail
        }

        return this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                embed: JSON.stringify(obj)
            }
        })
    }

    inputFooterText(e: any) {
        const text = e.target.value as string
        if(text[text.length-1] === ' ') return

        const obj = JSON.parse(this.props.data.embed)
        if(!obj?.footer) {
            obj.footer = { text: undefined }
        }

        if(text.length > 2048) return

        obj.footer.text = text

        if(obj.footer.text === '' && !obj.footer?.icon_url) {
            delete obj.footer
        }

        return this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                embed: JSON.stringify(obj)
            }
        })
    }

    inputFooterIconUrl(e: any) {
        const url = e.target.value as string
        if(url[url.length-1] === ' ') return

        const obj = JSON.parse(this.props.data.embed)
        if(!obj?.footer) {
            obj.footer = { icon_url: undefined }
        }

        if(!url.startsWith('http')) return

        obj.footer.icon_url = url

        if(!obj.footer.icon_url && !obj.footer?.text) {
            delete obj.footer
        }

        return this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                embed: JSON.stringify(obj)
            }
        })
    }

    inputFieldName(e: any) {
        const index = Number(e.target.id.split('.')[1])
        if(isNaN(index)) return

        const value = e.target.value
        if(value.length > 256 || value[value.length-1] === ' ') return

        const obj = JSON.parse(this.props.data.embed)
        if(!obj.fields[index]) return

        obj.fields[index].name = value

        return this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                embed: JSON.stringify(obj)
            }
        })
    }

    inputFieldValue(e: any) {
        const index = Number(e.target.id.split('.')[1])
        if(isNaN(index)) return

        const value = e.target.value
        if(value.length > 1024 || value[value.length-1] === ' ') return

        const obj = JSON.parse(this.props.data.embed)
        if(!obj.fields[index]) return

        obj.fields[index].value = value

        return this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                embed: JSON.stringify(obj)
            }
        })
    }

    switchFieldInline(e: any) {
        const index = Number(e.target.id.split('.')[1])
        if(isNaN(index)) return

        const obj = JSON.parse(this.props.data.embed)
        if(!obj.fields[index]) return

        obj.fields[index].inline = !obj.fields[index]?.inline

        return this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                embed: JSON.stringify(obj)
            }
        })
    }

    clickAddNewField(e: any) {
        const obj = JSON.parse(this.props.data.embed)
        if(!obj?.fields?.length) {
            obj.fields = []
        }
        
        if(obj.fields.length >= 25) return

        obj.fields.push(
            { name: `Field Name ${obj.fields.length+1}`, value: `Field Value ${obj.fields.length+1}`, inline: false }
        )

        return this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                embed: JSON.stringify(obj)
            }
        })
    }

    clickDeleteField(e: any) {
        const index = Number(e.target.id.split('.')[1])
        if(isNaN(index)) return

        const obj = JSON.parse(this.props.data.embed)
        if(!obj.fields[index]) return

        if(this.state.accordions[`field.${index}`]) {
            delete this.state.accordions[`field.${index}`]
            this.setState({ accordions: this.state.accordions })
        }

        obj.fields.splice(index, 1)

        return this.props.updateState({
            canSave: true,
            data: {
                ...this.props.data,
                embed: JSON.stringify(obj)
            }
        })
    }

    private isAllowWord(word: string) {
        return word.toLowerCase() !== word.toUpperCase() || !isNaN(parseInt(word)) || word === ' '
    }

    private convertToDiscordColor(color: string) {
        try {
            return parseInt(color).toString(16)
        } catch {
            return color
        }
    }

    private convertColor(hex: string) {
        if (hex.length % 2) { hex = '0' + hex.replace('#', '') }
        try {
            const bn = BigInt('0x' + hex)
            const fix = BigInt('0x010101')
            return isNaN(parseInt(bn.toString(10))) ? fix.toString(10) : bn.toString(10) 
        } catch {
            return BigInt('0x010101').toString(10)
        }
    }
}