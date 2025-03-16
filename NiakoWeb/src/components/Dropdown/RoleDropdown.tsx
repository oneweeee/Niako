import { Component, createRef } from "react";
import { IDropdownOption, IRoleDropdownProps } from "../../types/dropdown";
import styles from './RoleDropdown.module.scss'

import { ReactComponent as IconArrowDown } from '../../assets/svg/ArrowDown.svg';
import { ReactComponent as IconChooseBlockStroke } from '../../assets/svg/ChooseBlockStroke.svg';
import { ReactComponent as IconChooseBlockFill } from '../../assets/svg/ChooseBlockFill.svg';

export class RoleDropdown extends Component<IRoleDropdownProps, { style?: any, ref?: any, open: boolean, values?: string[], options: IDropdownOption[] }> {
    state = { open: false, values: (!this.props?.defaultValues?.length ? [] : this.props.defaultValues), ref: createRef() as any,  options: [] as any[], style: null as any }

    render() {
        return (
            <div className={styles.dropdown} ref={this.state.ref}>
                <div className={styles.header} onClick={this.updateOpen.bind(this)}>
                    <div className={styles.content}>
                    {
                        this.state.open && this.props.input ? (
                            <input
                            placeholder={this.props.placeholder || 'Выберите нужное...'}
                            disabled={!this.props.input || !this.state.open} onChange={this.inputSearch.bind(this)}
                            className={styles.input} type='text'
                            />
                        ) : (
                            <p className={this.props.placeholder && !this.state.values.filter((r) => this.props.options.some((o) => o.value === r)).length ? styles.placeholder : styles.text}>
                                {
                                    this.state.values.filter((r) => this.props.options.some((o) => o.value === r)).length > 0 ? this.state.values.map((id, i) => {
                                        const name = this.props.options.find((r) => r.value === id)?.label!
                                        return (<span key={id}>{name}{this.state.values.filter((r) => this.props.options.some((o) => o.value === r)).length-1 === i ? '' : ', '}</span>)
                                    }) : this.props.placeholder
                                }
                            </p>
                        )
                    }
                    </div>
                    { <IconArrowDown className={`${styles.icon} ${this.state.style || ''}`} /> }
                </div>
                <div className={`${styles.options} ${this.state.options.length === 0 ? styles.disabled : ''} ${this.state.open ? styles.open : ''}`}>
                    {
                        this.state.options.length > 0 ? this.state.options.map((i) => {
                            return (
                                <div key={i.value} className={styles.item} onClick={this.updateOption.bind(this, i.value)}>
                                    { this.props.maxCount !== 1 ? (this.state.values.includes(i.value) ? <IconChooseBlockFill /> : <IconChooseBlockStroke />) : '' }
                                    <p className={styles.text} style={(i?.color || '').length === 6 ? { color: `#${i?.color}` } : undefined}>{i.label}</p>
                                </div>
                            )
                        }) : (
                            <div className={`${styles.item} ${styles.disabled}`}>
                                <p className={styles.text}>Ничего не найдено!</p>
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }

    componentDidMount() {
        document.addEventListener('click', this.handleOutsideClick.bind(this))
        return this.setState({ options: this.props.options })
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleOutsideClick.bind(this))
    }

    inputSearch(e: any) {
        const value = e.target.value as string
        return this.setState({ options: this.props.options.filter((i) => i.label.toLowerCase().includes(value.toLowerCase())) })
    }

    updateOpen(e?: any) {
        if(e?.target?.tagName === 'INPUT') return
        const opend = !this.state.open
        const style = opend ? styles.open_icon : styles.close_icon
        return this.setState({ style, open: opend, options: this.props.options })
    }

    handleOutsideClick(e: any) {
        if(this.state.open && this.state.ref.current && !this.state.ref.current.contains(e.target)) {
            if(['SPAN', 'P', 'svg', 'path'].includes(e?.target?.tagName)) return
            return this.updateOpen(e)
        }
    }

    updateOption(value: string) {
        if(this.state.values.includes(value)) {
            this.state.values.splice(this.state.values.indexOf(value), 1)
            this.props.onClick(this.state.values)
            return this.setState({ values: this.state.values })
        } else {
            if(this.props.maxCount !== 1 && this.props?.maxCount && this.state.values.length >= this.props.maxCount) {
                if(this.props?.sendError) {
                    this.props.sendError(`Вы не можете выбрать больше ${this.props.maxCount} ролей`)
                }
                return
            }

            if(this.props.maxCount !== 1) {
                this.state.values.push(value)
            } else {
                this.updateOpen()
                this.state.values = [ value ]
            }
            this.props.onClick(this.state.values)
            return this.setState({ values: this.state.values })
        }
    }
}