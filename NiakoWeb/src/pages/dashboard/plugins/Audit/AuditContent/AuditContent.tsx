import { Component } from "react";
import { TextDropdown } from "../../../../../components/Dropdown/TextDropdown";
import { Button } from "../../../../../components/ButtonNew/Button";
import { Switcher } from "../../../../../components/Switcher/Switcher";
import styles from './AuditContent.module.scss'

import { ReactComponent as IconArrowRight } from '../../../../../assets/svg/ArrowRight.svg'
import { ReactComponent as IconArrowLeft } from '../../../../../assets/svg/ArrowLeft.svg'
import { Skeletone } from "../../../../../components/Skeletone/Skeletone";

export class AuditContent extends Component<{ updateState: (state: any) => any, isLoading?: boolean, page: number, setPage: (page: number | string) => any, discord: any, data: any, actions: { type: string, values: string[], title: string }[] }> {
    maxCount = 10

    render() {
        const maxPages = Math.ceil(this.props.actions.length/this.maxCount) === 0 ? 1 : Math.ceil(this.props.actions.length/this.maxCount)

        if(this.props?.isLoading) {
            return (
                <div className={styles.content}>
                    <div className={styles.loggers}>
                        {
                            this.props.actions.filter((_, i) => (i >= this.props.page*this.maxCount && i < this.maxCount*(this.props.page+1))).map(
                                (res, index) =>  <Skeletone key={res.type} className={styles.block} style={{ height: '100px' }} />
                            )
                        }
                    </div>
                    <div className={styles.container}>
                        <div className={styles.pagination}>
                            <Button onClick={this.toLeft.bind(this)} disabled={this.props.page === 0} rightIcon={IconArrowLeft} size='small' type='normal' styled='fill' />
                            <div className={styles.pages}>
                            {
                                new Array(maxPages).fill(null).map(
                                    (_, i) => (<Button key={i} onClick={this.setPage.bind(this, this, i)} label={`${i+1}`} size='small' type={i === this.props.page ? 'action' : 'normal'} styled={i === this.props.page ? 'fill' : 'outline'} />)
                                )
                            }
                            </div>
                            <Button onClick={this.toRight.bind(this)} disabled={this.props.page+1 === maxPages} rightIcon={IconArrowRight} size='small' type='normal' styled='fill' />
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className={styles.content}>
                <div className={styles.loggers}>
                    { this.props.actions.filter((_, i) => (i >= this.props.page*this.maxCount && i < this.maxCount*(this.props.page+1))).map((res, index) => this.getBlock(res, index)) }
                </div>
                <div className={styles.container}>
                    <div className={styles.pagination}>
                        <Button onClick={this.toLeft.bind(this)} disabled={this.props.page === 0} rightIcon={IconArrowLeft} size='small' type='normal' styled='fill' />
                        <div className={styles.pages}>
                            {
                                new Array(maxPages).fill(null).map(
                                    (_, i) => (<Button key={i} onClick={this.setPage.bind(this, this, i)} label={`${i+1}`} size='small' type={i === this.props.page ? 'action' : 'normal'} styled={i === this.props.page ? 'fill' : 'outline'} />)
                                )
                            }
                        </div>
                        <Button onClick={this.toRight.bind(this)} disabled={this.props.page+1 === maxPages} rightIcon={IconArrowRight} size='small' type='normal' styled='fill' />
                    </div>
                </div>
            </div>
        )
    }

    getBlock(res: { type: string, values: string[], title: string }, index: number) {
        const i = (this.props.page*this.maxCount+index+1)
        return (
            <div className={styles.block} key={res.type}>
                <div className={styles.title}>
                    <p className={styles.text}>{ res.title }</p>
                    <Switcher state={this.props.data.types.find((t: any) => t.type === res.type)?.state || false} onChange={this.onSwitch.bind(this, res.type)} />
                </div>
                <TextDropdown placement={this.maxCount*(this.props.page+1)-1 > i ? 'bottom' : 'top'} input={true} onClick={this.onSelectChannel.bind(this, res.type)} options={
                    this.props.discord.channels.map((r: any) => ({ label: r.name, value: r.id }))
                } placeholder='Выберите нужный канал...' defaultValue={this.props.data.types.find((t: any) => t.type === res.type)?.channelId} />
            </div>
        )
    }

    onSwitch(value: string, _: any) {
        let types = this.props.data.types as { state: boolean, channelId: string, type: string }[]
        const get = types.find((r) => r.type === value)
        if(get) {
            get.state = !get.state
        } else {
            types.push(
                {
                    type: value, state: true,
                    channelId: ''
                }
            )
        }

        types = this.checker(types)

        return this.props.updateState({
            data: {
                ...this.props.data,
                types
            }
        })
    }

    onSelectChannel(type: string, value: string) {
        let types = this.props.data.types as { state: boolean, channelId: string, type: string }[]
        const get = types.find((r) => r.type === type)
        if(!get) {
            types.push(
                {
                    type, state: false,
                    channelId: value
                }
            )
        } else {
            get.channelId = value
        }

        types = this.checker(types)

        return this.props.updateState({
            data: {
                ...this.props.data,
                types
            }
        })
    }

    checker(types: any[]) {
        for ( let i = 0; types.length > i; i++ ) {
            const res = types[i]
            if(!res.channelId && !res.state) {
                types.splice(i, 1)
            }
        }

        return types
    }

    toLeft() {
        const page = this.props.page === 0 ? 0 : this.props.page-1
        window.scrollTo({ top: 0 })
        return this.props.setPage(page)
    }

    toRight() {
        const maxPages = Math.ceil(this.props.actions.length/this.maxCount) === 0 ? 1 : Math.ceil(this.props.actions.length/this.maxCount)
        const page = this.props.page+1 === maxPages ? maxPages : this.props.page+1
        window.scrollTo({ top: 0 })
        return this.props.setPage(page)
    }

    setPage(_: any, value: string | number) {
        window.scrollTo({ top: 0 })
        return this.props.setPage(Number(value))
    }
}