import { Component } from "react";
import { CircularProgress } from "@mui/material";
import styles from './Button.module.scss'

export class Button extends Component<
    {
        onClick?: (value?: string | number) => any,
        label?: string,
        value?: string,
        leftIcon?: any,
        rightIcon?: any,
        styled: 'fill' | 'outline' | 'text',
        type: 'normal' | 'action' |  'success' | 'warning' | 'danger',
        className?: any,
        size: 'small' | 'medium' | 'big',
        disabled?: boolean,
        width?: 'auto' | 'max',
        loading?: boolean
    }
> {
    render() {
        const onlyIcon = !this.props?.label
        return (
            <div
            onClick={this.props?.disabled || this.props?.loading ? undefined : this.props.onClick?.bind(this, this.props?.value || this.props?.label)}
            className={`${styles.button} ${this.props.className} ${this.getStyles()} ${this.getSize(onlyIcon)} ${this.props.loading ? styles.loading : ''} ${this.props.disabled ? styles.disabled : ''}`}
            style={{width: this.props?.width === 'max' ? `calc(100% - ${this.getLateral()}px)` : 'auto'}}
            >
                { this.props?.leftIcon ? this.props?.loading ? <CircularProgress size={24} style={{color: '#ffffff'}} /> : <this.props.leftIcon className={styles.icon} /> : '' }
                { this.props?.label ? this.props?.loading ? '' : <p className={styles.label}>{this.props.label}</p> : '' }
                { this.props?.rightIcon ? <this.props.rightIcon className={styles.icon} /> : '' }
            </div>
        )
    }

    getSize(onlyIcon: boolean) {
        if(onlyIcon) {
            switch(this.props.size) {
                case 'big':
                    return styles.onlyIconBig
                case 'medium':
                    return styles.onlyIconMedium
                case 'small':
                    return styles.onlyIconSmall
            }
        } else {
            switch(this.props.size) {
                case 'big':
                    return styles.big
                case 'medium':
                    return styles.medium
                case 'small':
                    return styles.small
            }
        }
    }
    
    getLateral() {
        switch(this.props.size) {
            case 'big':
                return 16
            case 'medium':
                return 56
            case 'small':
                return 48
        }
    }

    getStyles() {
        switch(this.props.type) {
            case 'normal':
                switch(this.props.styled) {
                    case 'fill':
                        return styles.normalFill
                    case 'outline':
                        return styles.normalOutline
                    default:
                        return ''
                }
            case 'action':
                switch(this.props.styled) {
                    case 'fill':
                        return styles.actionFill
                    default:
                        return ''
                }
            default:
                return ''
        }
    }
}