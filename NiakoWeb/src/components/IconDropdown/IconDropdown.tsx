import { Component, createRef } from "react"
import styles from './IconDropdown.module.scss'
import { IconButton } from "../IconButton/IconButton"

import { ReactComponent as IconQuestion } from '../../assets/svg/QuestionStroke.svg';
import { ReactComponent as IconDocument } from '../../assets/svg/Document.svg';
import { ReactComponent as IconDiscord } from '../../assets/svg/Discord.svg';
import { Tooltip } from "@mui/material";

export class IconDropdown extends Component<{}, { show: boolean | null, ref: any, style: any }> {
    state = {
        show: null,
        ref: createRef() as any,
        style: {}
    }
    
    render() {
        return (
            <div ref={this.state.ref} className={styles.dropdown}>
                <IconButton icon={IconQuestion} onClick={this.setOpen.bind(this)} />
                <div className={`${styles.options} ${typeof this.state.show === 'object' ? '' : (this.state.show ? styles.open : styles.close)}`} style={this.state.style}>
                    <Tooltip componentsProps={{ tooltip: { sx: { borderRadius: '8px', color: 'var(--text-color)', backgroundColor: 'var(--primary-color)', fontSize: '0.75rem' } } }} title='Документация' placement="left">
                        <div>
                            <IconButton onClick={this.onClick.bind(this, 'https://docs.niako.xyz/')} className={this.state.show ? styles.iconOpen : styles.iconClose} icon={IconDocument} useMini={true} />
                        </div>
                    </Tooltip>
                    <Tooltip componentsProps={{ tooltip: { sx: { borderRadius: '8px', color: 'var(--text-color)', backgroundColor: 'var(--primary-color)', fontSize: '0.75rem' } } }} title='Сервер поддержки' placement="left">
                        <div>
                            <IconButton onClick={this.onClick.bind(this, 'https://discord.gg/wA3Mmsvmcm')} className={this.state.show ? styles.iconOpen : styles.iconClose} icon={IconDiscord} useMini={true} noFill={true} />
                        </div>
                    </Tooltip>
                </div>
            </div>
        )
    }

    componentDidMount() {
        document.addEventListener('click', this.handleOutsideClick.bind(this))
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleOutsideClick.bind(this))
    }

    onClick(link: string) {
        window.location.href = link
    }

    setOpen() {
        return this.setState({ show: !this.state.show })
    }

    handleOutsideClick(e: any) {
        if(this.state.show && this.state.ref.current && !this.state.ref.current.contains(e.target)) {
            return this.setOpen()
        }
    }

    updateStyle() {
        if(!this.state.ref?.current) return ''

        console.log(this.state.ref!.current)

        const icon = (this.state.ref!.current as any).getBoundingClientRect();

        this.setState({
            style: {
                botton: `${icon.left}px`
            }
        })

        return ''
    }
}