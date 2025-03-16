import { Component } from "react";
import { toHTML } from 'discord-markdown';
import styles from './DiscordMessage.module.scss'
import Avatar from '../../assets/img/DefaultAvatar.png';

import { ReactComponent as IconArrowDown } from '../../assets/svg/ArrowDown.svg';
import { Skeletone } from "../Skeletone/Skeletone";

export class DiscordMessage extends Component<{ updateButtons?: () => any, className?: any, width: number, data: any, loading?: boolean, webhook: { avatar?: string, avatarURL?: string, username?: string } }> {
    render() {
        if(this.props?.loading) {
            return <Skeletone type='discord_message' />
        }

        const messageOptions = JSON.parse(this.props.data)
        
        return (
            <div id={720 > this.props.width ? 'mobile' : 'discord'} className={`${styles.background} ${this.props?.className || ''}`}>
                <div className={styles.author_avatar}>
                    <img className={styles.avatar} alt='avatar' src={this.props.webhook?.avatar || this.props.webhook?.avatarURL || Avatar} />
                </div>
                <div className={styles.message}>
                    <div className={styles.header}>
                        <div className={styles.author}>
                            <p className={styles.username}>{this.props.webhook?.username || 'Unknown'}</p>
                            <div className={styles.badge}>
                                <p className={styles.name}>BOT</p>
                            </div>
                        </div>
                        <p className={styles.timestamp}>Сегодня, в {this.getDate()}</p>
                    </div>
                    { messageOptions?.content ? <div className={styles.content} dangerouslySetInnerHTML={{ __html: toHTML(messageOptions.content) }}></div> : '' }
                    {
                        !messageOptions?.embeds?.length ? '' : (
                            <div className={styles.embeds}>
                                {
                                    messageOptions.embeds.map((data: any, i: number) => {
                                        return this.getEmbed(data, i)
                                    })
                                }
                            </div>
                        )
                    }
                    {
                        !messageOptions?.components?.length ? '' : (
                            <div className={styles.components}>
                                {
                                    messageOptions.components.map((_: any, i: number) => {
                                        const isButtonRow = messageOptions.components[i].some((b: any) => b.extendType === 'Button')
                                        return (
                                            <div id={`row:${isButtonRow ? i + 1 : i}`} key={isButtonRow ? i + 1 : i}
                                            className={`${styles.row} ${isButtonRow ? 'draggable__container' : ''}`}
                                            >
                                                {
                                                    messageOptions.components[i].map((data: any, i: number) => {
                                                        switch(data.extendType) {
                                                            case 'Button':
                                                                return this.getButton(data)
                                                            case 'Select':
                                                                return this.getSelect(data, i)
                                                            default:
                                                                return <span key={i}>{data.extendType}</span>
                                                        }
                                                    })
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }

    addButtonEffect() {
        const draggables = document.querySelectorAll('.draggable')
        const droppables = document.querySelectorAll('.draggable__container')
        const selects = document.querySelectorAll(`.${styles.select}`)

        draggables.forEach((task) => {
            if(!task) return

            task.addEventListener("dragstart", () => {
                if(!task) return
                task.classList.add("is-dragging")
            })
            task.addEventListener("dragend", () => {
                if(!task) return
                task.classList.remove("is-dragging")
            })
        })

        selects.forEach((s) => {
            if(s.parentElement) {
                s.parentElement.removeEventListener('dragover', () => {})
            }
        })
          
        droppables.forEach((zone) => {
            if(!zone) return
            
            zone.addEventListener("dragover", (e: any) => {
                if(!zone || !e) return

                e.preventDefault()

                const getButton = insertAboveTask(zone, e.clientX)
                const curTask = document.querySelector(".is-dragging")!
            
                if (!getButton) {
                    if(!zone) return
                    zone.appendChild(curTask)
                } else if(zone) {
                    if(!zone || !curTask || !getButton) return
                    zone.insertBefore(curTask, getButton || null)
                }

                if(this.props?.updateButtons) {
                    this.props.updateButtons()
                }
            })
        })
          
        const insertAboveTask = (zone: any, mouseX: number) => {
            if(!zone) return null
                        
            const els = zone.querySelectorAll(".draggable:not(.is-dragging)");
          
            let closestTask = null
            let closestOffsetX = Number.NEGATIVE_INFINITY
          
            els.forEach((task: any) => {
                if(!task) return
                const { right, left } = task.getBoundingClientRect()
          
                const offsetLeftX = mouseX - left
                const offsetRightX = mouseX - right
            
                if (offsetLeftX < 0 && offsetLeftX > closestOffsetX) {
                    closestOffsetX = offsetLeftX
                    closestTask = task
                }
  
                if (offsetRightX < 0 && offsetRightX > closestOffsetX) {
                    closestOffsetX = offsetRightX
                    closestTask = task
                }
            })
          
            return closestTask
        }
    }

    componentDidMount() {
        this.addButtonEffect()
    }

    componentDidUpdate(props: any) {
        if(props.data !== this.props.data || props.loading !== this.props.loading) {
            this.addButtonEffect()
        }
    }

    getEmbed(data: any, key: number) {
        const title = data?.title ? (
            !data?.url ? (
                <p className={styles.title} dangerouslySetInnerHTML={{ __html: toHTML(data.title, { embed: true }) }}></p>
            ) : <a className={`${styles.title} ${styles.url}`} href={data.url} dangerouslySetInnerHTML={{ __html: toHTML(data.title, { embed: true }) }}></a>
        ) : ''
        const description = data?.description ? <div className={styles.description} dangerouslySetInnerHTML={{ __html: toHTML(data.description, { embed: true }) }}></div> : ''
        const author = data?.author?.name ? (
            <div className={styles.author}>
                { data.author?.icon_url ? <img className={styles.author_icon} src={data.author.icon_url} alt='icon_url' /> : '' }
                { data.author?.name && !data.author?.url ? <p className={styles.name}>{data.author.name}</p> : '' }
                { data.author?.name && data.author?.url ? <a rel='noopener'  href={data.author.url} className={`${styles.name} ${styles.nameurl}`}>{data.author.name}</a> : '' }
            </div>
        ) : ''
        const thumbnail = data?.thumbnail?.url ? (
            <img className={styles.thumbnail} alt='thumbnail' src={data.thumbnail.url} />
        ) : ''
        const image = data?.image?.url ? (
            <img className={styles.image} alt='media' src={data.image.url} />
        ) : ''
        const fields = !data?.fields?.length ? '' : this.getFields(data?.fields)
        let timestamp: any = ''

        /*if(data?.timestamp) {
            const date = new Date(data?.timestamp).getTime()
            timestamp = <div className={styles.timestamp}><p>•</p><p className={styles.text}>{date}</p></div>
        }*/

        const footer = data?.footer?.text ? (
            <div className={styles.footer}>
                { data.author?.icon_url ? <img className={styles.footer_icon} src={data.footer.icon_url} alt='icon_url' /> : '' }
                { data.footer?.text ? <p className={styles.text}>{data.footer.text}</p> : '' }
                { timestamp }
            </div>
        ) : ''


        return (
            <div key={key} className={styles.embed}>
                <div className={styles.root}>
                    <span className={styles.line} style={{background: '#' + parseInt(data.color).toString(16) }}></span>
                    <div className={styles.container}>
                        <div className={styles.wrapper}>
                            <div className={styles.content}>
                            { author }
                            { title }
                            { description }
                            { fields }
                            { image }
                            { footer }
                            </div>
                            { thumbnail }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    getFields(fields: { name?: string, value?: string, inline?: boolean }[]) {
        return <div className={styles.fields}>
            {
                fields.map((f, i) => {
                    return (
                        <div key={i} className={`${styles.field} ${this.getFieldNumber(fields, i)} ${f?.inline ? styles.inline : ''}`}>
                            { f?.name ? <p className={styles.name} dangerouslySetInnerHTML={{ __html: toHTML(f.name, { embed: true }) }}></p> : '' }
                            { f?.value ? <p className={styles.value} dangerouslySetInnerHTML={{ __html: toHTML(f.value, { embed: true }) }}></p> : '' }
                        </div>
                    )
                })
            }
        </div>
    }

    getFieldNumber(fields: { name?: string, value?: string, inline?: boolean }[], index: number) {
        if(fields[index] && !fields[index]?.inline) {
            return ''
        }
        
        if(fields[index-2] && fields[index-2]?.inline) {
            return styles.inline_3
        }
        
        if(fields[index-1] && fields[index-1]?.inline) {
            return styles.inline_2
        }

        return styles.inline_1
    }

    getButton(data: any) {
        if(data?.emoji) {
            if(!this.getEmojiIcon(data.emoji)) {
                return ''
            }
        }

        return (
            <div key={data.custom_id} id={data.custom_id} className={`${styles.button} draggable ${this.getButtonStyle(data.style)}`} draggable={true}>
                { this.getEmojiIcon(data.emoji) }
                { data?.label ? <p className={styles.label}>{data.label}</p> : '' }
            </div>
        )
    }

    getSelect(data: { placeholder?: string }, key: number) {
        return (
            <div key={key} className={styles.select}>
                <p className={styles.placeholder}>{data.placeholder || 'Выберите нужное'}</p>
                <IconArrowDown className={styles.icon} />
            </div>
        )
    }

    getDate() {
        const date = new Date()
        return `${this.formatNumber(date.getHours())}:${this.formatNumber(date.getMinutes())}`
    }

    private formatNumber(num: number) {
        if(10 > num) {
            return '0' + num
        } else {
            return String(num)
        }
    }

    private getEmojiIcon(emoji?: string) {
        if(!emoji) return ''
        if(!emoji.startsWith('<')) {
            return (<p>{emoji}</p>)
        }
        if(!emoji.endsWith('>')) return ''
        if(emoji.split(':')?.length !== 3) return ''

        const src = `https://cdn.discordapp.com/emojis/${emoji.split(':')[2].replace('>', '')}.${emoji.startsWith('<a:') ? 'gif' : 'png'}?size=96`
        return (
            <img className={styles.emoji} src={src} alt='emoji'/>
        )
    }

    private getButtonStyle(style: number) {
        switch(style) {
            case 1:
                return styles.button_blue
            case 3:
                return styles.button_green
            case 4:
                return styles.button_red
            default:
                return ''
        }
    }
}