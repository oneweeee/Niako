import { Component } from "react";
import { TextArea } from "../../../../../components/TextArea/TextArea";
import { Input } from "../../../../../components/Input/Input";
import { Switcher } from "../../../../../components/Switcher/Switcher";
import styles from './ChangeContent.module.scss'

import { ReactComponent as IconAddCircle } from '../../../../../assets/svg/AddCircleStroke.svg'
import { ReactComponent as IconArrowDown } from '../../../../../assets/svg/ArrowDown.svg'
import { ReactComponent as IconTrash } from '../../../../../assets/svg/Trash.svg'
import { Skeletone } from "../../../../../components/Skeletone/Skeletone";

export class ChangeContent extends Component<{ isLoading?: boolean, webhooks: any, channels: any, content: any, type: string, sendError: (msg: string) => any, updateState: (state: any) => any }, { opens: string[], accordions: { [key: string]: any } }> {
    state = { opens: [] as string[], accordions: {} as any }

    render() {
        if(this.props.isLoading) {
            return <Skeletone style={{height: '70%'}} />
        }

        return (
            <div className={styles.wrapper}>
                <div className={styles.cell}>
                    <div className={styles.title}>
                        <p className={styles.text}>Контент</p>
                    </div>
                    <TextArea onChange={this.onInputContent.bind(this)} maxLength={4096} />
                </div>
                <div className={styles.embeds}>
                    <div className={styles.embed}>
                        <div className={styles.accordion}>
                            <p className={styles.title}>Embeds {this.props.content?.embeds?.length || 0}/10</p>
                            <div className={styles.rowbutton}>
                                <div onClick={this.clickAddNewEmbed.bind(this)} className={styles.button}>
                                    <IconAddCircle className={styles.icon} />
                                </div>
                            </div>
                        </div>
                        {
                            (this.props.content?.embeds || []).map((e: any, i: number) => (
                                <div key={`Embed${i}`} className={`${styles.embed} ${i + 1 === this.props.content.embeds.length ? styles.lastEmbed : ''}`}>
                                    <div className={styles.accordion} onClick={this.onClickAccrodion.bind(this, `Embed.${i}`)}>
                                        <p className={styles.title}>Embed {i + 1}</p>
                                        <div className={styles.rowbutton}>
                                            <div onClick={this.cliclDeleteEmbed.bind(this, i)} className={styles.button}>
                                                <IconTrash className={styles.icon} />
                                            </div>
                                            <IconArrowDown className={`${styles.icon} ${this.state.accordions[`Embed.${i}`]}`} />
                                        </div>
                                    </div>
                                    {
                                        !this.state.opens.includes(`Embed.${i}`) ? '' : <div className={styles.embedContent}>
                                            <div className={styles.author}>
                                                <div className={styles.accordion} onClick={this.onClickAccrodion.bind(this, `Author.${i}`)}>
                                                    <p className={styles.title}>Author</p>
                                                    <IconArrowDown className={`${styles.icon} ${this.state.accordions[`Author.${i}`]}`} />
                                                </div>
                                                {
                                                    this.state.opens.includes(`Author.${i}`) ? (
                                                        <div className={styles.row}>
                                                            <div className={styles.cell}>
                                                                <p className={styles.text}>Name</p>
                                                                <Input onChange={this.inputAuthorName.bind(this, i)} placeholder='Name' value={e?.author?.name || ''} maxLength={256} />
                                                            </div>
                                                            <div className={styles.cell}>
                                                                <p className={styles.text}>Author Url</p>
                                                                <Input onChange={this.inputAuthorUrl.bind(this, i)} placeholder='Url' value={e?.author?.url || ''} />
                                                            </div>
                                                            <div className={styles.cell}>
                                                                <p className={styles.text}>Author Icon Url</p>
                                                                <Input onChange={this.inputAuthorIconUrl.bind(this, i)} placeholder='Icon Url' value={e?.author?.icon_url || ''} />
                                                            </div>
                                                        </div>
                                                    ) : ''
                                                }
                                            </div>
                                            <div className={styles.body}>
                                                <div className={styles.accordion} onClick={this.onClickAccrodion.bind(this, `Body.${i}`)}>
                                                    <p className={styles.title}>Body</p>
                                                    <IconArrowDown className={`${styles.icon} ${this.state.accordions[`Body.${i}`]}`} />
                                                </div>
                                                {
                                                    this.state.opens.includes(`Body.${i}`) ? (
                                                        <div className={`${styles.row} ${styles.column}`}>
                                                            <div className={styles.group}>
                                                                <div className={`${styles.cell} ${styles.width}`}>
                                                                    <p className={styles.text}>Title</p>
                                                                    <Input onChange={this.inputTitle.bind(this, i)} placeholder='Title' value={e?.title || ''} maxLength={256} />
                                                                </div>
                                                                <div className={`${styles.cell} ${styles.width}`}>
                                                                    <p className={styles.text}>Description</p>
                                                                    <TextArea onChange={this.inputDescription.bind(this, i)} content={e?.description || ''} maxLength={4096} />
                                                                </div>
                                                            </div>
                                                            <div className={`${styles.cell} ${styles.width}`}>
                                                                <p className={styles.text}>Url</p>
                                                                <Input onChange={this.inputUrl.bind(this, i)} placeholder='Url' value={e?.url || ''} />
                                                            </div>
                                                            <div className={`${styles.cell} ${styles.width}`}>
                                                                <p className={styles.text}>Color</p>
                                                                <div className={styles.color_picker}>
                                                                    <input id={`colorPicker.${i}`} className={styles.picker} value={e?.color ? '#' + this.convertToDiscordColor(e?.color) : ''} onChange={this.pickerColor.bind(this, i)} type='color' style={{ background: e?.color ? '#' + parseInt(e?.color).toString(16) : undefined }} />
                                                                    <Input id={`colorInput.${i}`} onChange={this.inputColor.bind(this, i)} value={e?.color ? '#' + this.convertToDiscordColor(e?.color) : ''} maxLength={7} minLength={7} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : ''
                                                }
                                            </div>
                                            <div className={styles.images}>
                                                <div className={styles.accordion} onClick={this.onClickAccrodion.bind(this, `Images.${i}`)}>
                                                    <p className={styles.title}>Images</p>
                                                    <IconArrowDown className={`${styles.icon} ${this.state.accordions[`Images.${i}`]}`} />
                                                </div>
                                                {
                                                    this.state.opens.includes(`Images.${i}`) ? (
                                                        <div className={styles.row}>
                                                            <div className={styles.cell}>
                                                                <p className={styles.text}>Image</p>
                                                                <Input onChange={this.inputImageUrl.bind(this, i)} placeholder='Image' value={e?.image?.url || ''} />
                                                            </div>
                                                            <div className={styles.cell}>
                                                                <p className={styles.text}>Thumbnail</p>
                                                                <Input onChange={this.inputThumbnailUrl.bind(this, i)} placeholder='Thumbnail' value={e?.thumbnail?.url || ''} />
                                                            </div>
                                                        </div>
                                                    ) : ''
                                                }
                                            </div>
                                            <div className={styles.footer}>
                                                <div className={styles.accordion} onClick={this.onClickAccrodion.bind(this, `Footer.${i}`)}>
                                                    <p className={styles.title}>Footer</p>
                                                    <IconArrowDown className={`${styles.icon} ${this.state.accordions[`Footer.${i}`]}`} />
                                                </div>
                                                {
                                                    this.state.opens.includes(`Footer.${i}`) ? (
                                                        <div className={styles.row}>
                                                            <div className={styles.cell}>
                                                                <p className={styles.text}>Footer Text</p>
                                                                <Input onChange={this.inputFooterText.bind(this, i)} placeholder='Footer' value={e?.footer?.text || ''} maxLength={2048} />
                                                            </div>
                                                            <div className={styles.cell}>
                                                                <p className={styles.text}>Footer Icon Url</p>
                                                                <Input onChange={this.inputFooterIconUrl.bind(this, i)} placeholder='Icon Url' value={e?.footer?.icon_url || ''} />
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
                                                <div className={styles.accordion} onClick={this.onClickAccrodion.bind(this, `Fields.${i}`)}>
                                                    <p className={styles.title}>Fields {(e?.fields || []).length}/25</p>
                                                    <div className={styles.rowbutton}>
                                                        <div onClick={this.clickAddNewField.bind(this, i)} className={styles.button}>
                                                            <IconAddCircle className={styles.icon} />
                                                        </div>
                                                        <IconArrowDown className={`${styles.icon} ${this.state.accordions[`Fields.${i}`]}`} />
                                                    </div>
                                                </div>
                                                {
                                                    this.state.opens.includes(`Fields.${i}`) && (e?.fields || []).length > 0 ? (
                                                        <div className={styles.row}>
                                                            {
                                                                e.fields.map((f: { name?: string, value?: string, inline: boolean }, id: number) => {
                                                                    return (
                                                                        <div key={`Embed${id}Field${i}`} className={styles.field}>
                                                                            <div className={styles.accordion} onClick={this.onClickAccrodion.bind(this, `field.${i}.${id}`)}>
                                                                                <p className={styles.title}>Field {i + 1}</p>
                                                                                <div className={styles.rowbutton}>
                                                                                    <div id={`field.${i}`} className={styles.button} onClick={this.clickDeleteField.bind(this, i, id)}>
                                                                                        <IconTrash id={`field.${i}`} className={styles.icon} />
                                                                                    </div>
                                                                                    <IconArrowDown className={`${styles.icon} ${this.state.accordions[`field.${i}.${id}`]}`} />
                                                                                </div>
                                                                            </div>
                                                                            {
                                                                                this.state.opens.includes(`field.${i}.${id}`) ? (
                                                                                    <div className={styles.manage_field}>
                                                                                        <div className={styles.row}>
                                                                                            <div className={styles.cell}>
                                                                                                <p className={styles.text}>Name</p>
                                                                                                <Input id={`field.${id}`} onChange={this.inputFieldName.bind(this, i, id)} placeholder='Name' value={f?.name || ''} />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className={styles.row}>
                                                                                            <div className={styles.cell}>
                                                                                                <p className={styles.text}>Value</p>
                                                                                                <TextArea id={`field.${id}`} onChange={this.inputFieldValue.bind(this, i, id)} content={f?.value || ''} maxLength={1024} />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className={`${styles.row} ${styles.rowswitch}`}>
                                                                                            <div className={styles.blockswitch}>
                                                                                                <p className={styles.text}>Inline</p>
                                                                                                <Switcher id={`field.${id}`} onChange={this.switchFieldInline.bind(this, i, id)} state={f?.inline} />
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
                                    }
                                    {i + 1 !== this.props.content.embeds.length ? <div className={styles.line}></div> : ''}
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }

    onClickAccrodion(type: string) {
        const accordions = structuredClone(this.state.accordions)
        if (this.state.opens.includes(type)) {
            this.state.opens.splice(this.state.opens.indexOf(type), 1)
            accordions[type] = styles.close_icon
            return this.setState({ opens: this.state.opens, accordions })
        } else {
            this.state.opens.push(type)
            accordions[type] = styles.open_icon
            return this.setState({ opens: this.state.opens, accordions })
        }
    }

    onInputContent(e: any) {
        if (e.target.value.length > 4096) {
            e.target.value = e.target.value.slice(0, 4096)
        }

        return this.props.updateState({
            content: {
                ...this.props.content,
                content: e.target.value
            }
        })
    }

    clickAddNewEmbed() {
        if (!this.props.content?.embeds?.length) {
            this.props.content.embeds = []
        }

        if (this.props.content.embeds.length >= 10) return

        this.props.content.embeds.push({ title: `${this.props.content.embeds.length + 1}` })

        return this.props.updateState({
            content: {
                ...this.props.content,
                embeds: this.props.content.embeds
            }
        })
    }

    inputAuthorName(id: number, e: any) {
        const name = e.target.value as string
        if (name[name.length - 1] === ' ') return

        const obj = this.props.content.embeds[id]
        if (!obj?.author) {
            obj.author = { name: undefined }
        }

        if (name.length > 256) return

        obj.author.name = name

        if (obj.author.name === '' && !obj.author?.icon_url) {
            delete obj.author
        }

        return this.props.updateState({
            content: {
                ...this.props.content,
                embeds: this.props.content.embeds
            }
        })
    }

    inputAuthorIconUrl(id: number, e: any) {
        const url = e.target.value as string
        if (url[url.length - 1] === ' ') return

        const obj = this.props.content.embeds[id]
        if (!obj?.author) {
            obj.author = { icon_url: undefined }
        }

        if (!url.startsWith('http')) return

        obj.author.icon_url = url

        if (!obj.author.icon_url && !obj.author?.name) {
            delete obj.author
        }

        return this.props.updateState({
            content: {
                ...this.props.content,
                embeds: this.props.content.embeds
            }
        })
    }

    inputAuthorUrl(id: number, e: any) {
        const url = e.target.value as string
        if (url[url.length - 1] === ' ') return

        const obj = this.props.content.embeds[id]
        if (!obj?.author) {
            obj.author = { url: undefined }
        }

        if (!url.startsWith('http')) return

        obj.author.url = url

        if (!obj.author.icon_url && !obj.author?.name && !obj.author?.url) {
            delete obj.author
        }

        return this.props.updateState({
            content: {
                ...this.props.content,
                embeds: this.props.content.embeds
            }
        })
    }

    inputTitle(id: number, e: any) {
        const name = e.target.value as string
        if (name[name.length - 1] === ' ') return

        const obj = this.props.content.embeds[id]
        if (!obj?.title) {
            obj.title = ''
        }

        if (name.length > 256) return

        obj.title = name

        if (!obj.title) {
            delete obj.title
        }

        return this.props.updateState({
            content: {
                ...this.props.content,
                embeds: this.props.content.embeds
            }
        })
    }

    inputDescription(id: number, e: any) {
        const name = e.target.value as string
        if (name[name.length - 1] === ' ') return

        const obj = this.props.content.embeds[id]
        if (!obj?.description) {
            obj.description = ''
        }

        if (name.length > 4096) return

        obj.description = name

        if (!obj.description) {
            delete obj.description
        }

        return this.props.updateState({
            content: {
                ...this.props.content,
                embeds: this.props.content.embeds
            }
        })
    }

    inputUrl(id: number, e: any) {
        const url = e.target.value as string
        if (url[url.length - 1] === ' ') return

        const obj = this.props.content.embeds[id]
        if (!obj?.url) {
            obj.url = ''
        }

        obj.url = url

        if (!obj.url || !obj.url.startsWith('http')) {
            delete obj.url
        }

        return this.props.updateState({
            content: {
                ...this.props.content,
                embeds: this.props.content.embeds
            }
        })
    }

    pickerColor(id: number, e: any) {
        const color = e.target.value as string
        const el = document.getElementById(`colorInput.${id}`) as any
        if (el) {
            el.value = color
        }

        const obj = this.props.content.embeds[id]
        obj.color = !color.startsWith('#') && color.length !== 7 ? this.convertColor('010101') : this.convertColor(color)

        if (!obj?.color) {
            delete obj.color
        }

        return this.props.updateState({
            content: {
                ...this.props.content,
                embeds: this.props.content.embeds
            }
        })
    }

    inputColor(id: number, e: any) {
        const color = e.target.value as string
        if (color.length !== 7 && !color.startsWith('#')) {
            return this.props.sendError('Укажите #HEX код цвета')
        }

        if (color.split('').some((w) => !this.isAllowWord(w) && w !== '#')) {
            return this.props.sendError('Некорректные символы в дефолтном цвете')
        }

        const obj = this.props.content.embeds[id]
        obj.color = !color.startsWith('#') && color.length !== 7 ? this.convertColor('010101') : this.convertColor(color)

        if (!obj?.color) {
            delete obj.color
        }

        return this.props.updateState({
            content: {
                ...this.props.content,
                embeds: this.props.content.embeds
            }
        })
    }


    inputImageUrl(id: number, e: any) {
        const url = e.target.value as string
        if (url[url.length - 1] === ' ') return

        const obj = this.props.content.embeds[id]
        if (!obj?.image) {
            obj.image = { url: '' }
        }

        obj.image.url = url

        if (!obj.image.url || !obj.image.url.startsWith('http')) {
            delete obj.image
        }

        return this.props.updateState({
            content: {
                ...this.props.content,
                embeds: this.props.content.embeds
            }
        })
    }

    inputThumbnailUrl(id: number, e: any) {
        const url = e.target.value as string
        if (url[url.length - 1] === ' ') return

        const obj = this.props.content.embeds[id]
        if (!obj?.thumbnail) {
            obj.thumbnail = { url: '' }
        }

        obj.thumbnail.url = url

        if (!obj.thumbnail.url || !obj.thumbnail.url.startsWith('http')) {
            delete obj.thumbnail
        }

        return this.props.updateState({
            content: {
                ...this.props.content,
                embeds: this.props.content.embeds
            }
        })
    }

    inputFooterText(id: number, e: any) {
        const text = e.target.value as string
        if (text[text.length - 1] === ' ') return

        const obj = this.props.content.embeds[id]
        if (!obj?.footer) {
            obj.footer = { text: undefined }
        }

        if (text.length > 2048) return

        obj.footer.text = text

        if (obj.footer.text === '' && !obj.footer?.icon_url) {
            delete obj.footer
        }

        return this.props.updateState({
            content: {
                ...this.props.content,
                embeds: this.props.content.embeds
            }
        })
    }

    inputFooterIconUrl(id: number, e: any) {
        const url = e.target.value as string
        if (url[url.length - 1] === ' ') return

        const obj = this.props.content.embeds[id]
        if (!obj?.footer) {
            obj.footer = { icon_url: undefined }
        }

        if (!url.startsWith('http')) return

        obj.footer.icon_url = url

        if (!obj.footer.icon_url && !obj.footer?.text) {
            delete obj.footer
        }

        return this.props.updateState({
            content: {
                ...this.props.content,
                embeds: this.props.content.embeds
            }
        })
    }

    inputFieldName(id: number, index: number, e: any) {
        const value = e.target.value
        if (value.length > 256 || value[value.length - 1] === ' ') return

        const obj = this.props.content.embeds[id]
        if (!obj.fields[index]) return

        obj.fields[index].name = value

        return this.props.updateState({
            content: {
                ...this.props.content,
                embeds: this.props.content.embeds
            }
        })
    }

    inputFieldValue(id: number, index: number, e: any) {
        const value = e.target.value
        if (value.length > 1024 || value[value.length - 1] === ' ') return

        const obj = this.props.content.embeds[id]
        if (!obj.fields[index]) return

        obj.fields[index].value = value

        return this.props.updateState({
            content: {
                ...this.props.content,
                embeds: this.props.content.embeds
            }
        })
    }

    switchFieldInline(id: number, index: number, _: any) {
        const obj = this.props.content.embeds[id]
        if (!obj.fields[index]) return

        obj.fields[index].inline = !obj.fields[index]?.inline

        return this.props.updateState({
            content: {
                ...this.props.content,
                embeds: this.props.content.embeds
            }
        })
    }

    clickAddNewField(id: number, e: any) {
        const obj = this.props.content.embeds[id]
        if (!obj?.fields?.length) {
            obj.fields = []
        }

        if (obj.fields.length >= 25) return

        obj.fields.push(
            { name: `Field Name ${obj.fields.length + 1}`, value: `Field Value ${obj.fields.length + 1}`, inline: false }
        )

        return this.props.updateState({
            content: {
                ...this.props.content,
                embeds: this.props.content.embeds
            }
        })
    }

    clickDeleteField(id: number, index: number, _: any) {
        const obj = this.props.content.embeds[id]
        if (!obj.fields[index]) return

        if (this.state.accordions[`field.${index}`]) {
            delete this.state.accordions[`field.${index}`]
            this.setState({ accordions: this.state.accordions })
        }

        obj.fields.splice(index, 1)

        return this.props.updateState({
            content: {
                ...this.props.content,
                embeds: this.props.content.embeds
            }
        })
    }

    cliclDeleteEmbed(id: number) {
        const e = (this.props.content.embeds || [])[id]
        if (!e) return

        this.props.content.embeds.splice(id, 1)

        return this.props.updateState({
            content: {
                ...this.props.content,
                embeds: this.props.content.embeds
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