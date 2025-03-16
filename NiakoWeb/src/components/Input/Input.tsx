import { Component } from "react";
import styles from './Input.module.scss'

export class Input extends Component<{ className?: any, iconStart?: boolean, id?: string, type?: string, value?: string, align?: 'left' | 'center' | 'right', placeholder?: string, maxLength?: number, minLength?: number, max?: number, min?: number, onChange: (e: any) => any }> {
    render() {
        return (
            <input onChange={this.props.onChange} id={this.props.id}
            className={`${styles.input} ${this.props.className} ${this.resolveAlignStyle()} ${this.props.iconStart ? styles.iconStart : ''}`} type={this.props.type || 'text'} minLength={this.props.minLength} min={this.props.min}
            defaultValue={this.props.value} placeholder={this.props.placeholder} maxLength={this.props.maxLength} max={this.props.max}
            />
        )
    }

    resolveAlignStyle() {
        switch(this.props.align) {
            case 'center':
                return styles.center
            case 'right':
                return styles.right
            default:
                return styles.left
        }
    }
}