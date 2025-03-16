import { Component, createRef } from "react";
import { IDropdownOption, ITextDropdownProps } from "../../types/dropdown";
import styles from './TextDropdown.module.scss'

import { ReactComponent as IconArrowDown } from '../../assets/svg/ArrowDown.svg';

export class TextDropdown extends Component<ITextDropdownProps, { style?: any, ref: any, open: boolean, value?: string, options: IDropdownOption[] }> {
    state = { open: false, value: this.props.defaultValue, options: [] as any[], ref: createRef() as any, style: null as any }

    render() {
        return (
            <div className={styles.dropdown}>
                <div className={`${styles.header} ${this.props?.disabled ? styles.disabled : ''}`} onClick={this.props?.disabled ? undefined : this.updateOpen.bind(this)} ref={this.state.ref}>
                    {
                        this.state.open && this.props.input ? (
                            <div className={styles.content}>
                                <input placeholder={this.props.placeholder || 'Выберите нужное...'}
                                disabled={!this.props.input || !this.state.open} onChange={this.inputSearch.bind(this)}
                                className={styles.input} type='text' value={
                                    this.props.options.find((i) => i.value === this.state.value)?.label || this.state.value || ''
                                }
                                />
                            </div>
                        ) : (
                            <div className={styles.content}>
                                { this.props.options.find((i) => i.value === this.state.value)?.icon }
                                <p className={this.props.placeholder && !this.state.value ? styles.placeholder : styles.text}>
                                    {
                                        (this.props.options.find((i) => i.value === this.state.value)?.label || this.state.value || this.props.placeholder || '')
                                    }
                                </p>
                            </div>
                        )
                    }
                    { <IconArrowDown className={`${styles.icon} ${this.state.style || ''}`} /> }
                </div>
                <div className={`${styles.options} ${this.props?.placement === 'top' ? styles.up : styles.down} ${this.state.options.length === 0 ? styles.disabled : ''} ${this.state.open ? styles.open : ''}`}>
                    {
                        this.state.options.length > 0 ? this.state.options.map((i) => {
                            return (
                                <div key={i.value} className={styles.item} onClick={(e) => { this.props.onClick(i.value); this.updateOpen.bind(this)(e, i.value); }}>
                                    { i?.icon ? i.icon : '' }
                                    { i?.img ? <img className={styles.image} alt='img' src={i.img} /> : '' }
                                    <p
                                    className={styles.text}
                                    style={
                                        { ...(i?.color || '').length === 6 ? { color: `#${i?.color}` } : {}, fontFamily: (i?.font ? i.font : undefined) }
                                    }>{i.label}</p>
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
        return this.setState({ value, options: this.props.options.filter((i) => i.label.toLowerCase().includes(value.toLowerCase())) })
    }

    updateOpen(e: any, value?: string) {
        if(e.target.tagName === 'INPUT') return
        const opened = !this.state.open
        const style = opened ? styles.open_icon : styles.close_icon

        return this.setState({
            style, open: opened,
            value: (this.state.open ? (value || this.props.defaultValue) : this.state.value),
            options: this.props.options
        })
    }

    handleOutsideClick(e: any) {
        if (this.state.open && this.state.ref.current && !this.state.ref.current.contains(e.target)) {
            if(e?.target?.tagName === 'P') return
            return this.updateOpen(e)
        }
    }

    getPosition() {
        if(!this.state.ref.current) return

        const windowHeight = document.getElementById('body')!.clientHeight
        const dropdownPosition = (this.state.ref!.current as any).getBoundingClientRect();
        
        return dropdownPosition.bottom + 100 > windowHeight ? styles.up : styles.down
    }
}