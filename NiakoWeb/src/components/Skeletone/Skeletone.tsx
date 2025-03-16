import { CSSProperties, Component } from "react";
import styles from './Skeletone.module.scss'

type TType = 'dropdown' | 'input' |  'button' | 'switcher' | 'tabs' | 'settings' | 'discord_message'

export class Skeletone extends Component<{ className?: string, style?: CSSProperties, type?: TType }> {
    render() {
        return (
            <div className={`${styles.skeleton} ${styles.skeleton_text} ${this.getStyle(this.props.type)} ${this.props.className || ''}`} style={this.props.style}></div>
        )
    }

    getStyle(type?: TType) {
        switch(type) {
            case 'input':
                return styles.input
            case 'button':
                return styles.button
            case 'dropdown':
                return styles.dropdown
            case 'switcher':
                return styles.switcher
            case 'tabs':
                return styles.tabs
            case 'settings':
                return styles.settings
            case 'discord_message':
                return styles.discord_message
            default:
                return ''
        }
    }
}