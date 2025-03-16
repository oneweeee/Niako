import { CircularProgress } from "@mui/material";
import { Component } from "react";
import { IButtonOptions } from "../../types/button";
import styles from './Button.module.scss'

export class Button extends Component<IButtonOptions> {
    render() {
        if(this.props?.loading) {
            return (
                <div className={`${styles.button} ${this.getType()} ${this.getLoadingType()} ${styles.loading}`} style={{ alignSelf: this.props.alignSelf }}>
                    <CircularProgress size={24} className={styles.loader} />
                </div>
            )
        }

        return (
            <div className={`${styles.button} ${this.props?.className || ''} ${this.getType()}`} onClick={this.props?.onClick ? this.props.onClick.bind(this) : this.props?.href ? () => { window.location.href = this.props.href! } : undefined} style={{ alignSelf: this.props.alignSelf }}>
                { this.props?.icon && <this.props.icon className={styles.icon}/> }
                { this.props?.content && <p className={styles.text}>{this.props.content}</p> }
            </div>
        )
    }

    private getType() {
        switch(this.props.type) {
            case 'Fill':
                switch(this.props.color) {
                    case 'Theme':
                        return styles.theme__fill
                    case 'Red':
                        return styles.red__fill
                    default:
                        return styles.primary__fill
                }
            case 'Stroke':
                return styles.button__stroke
        }
    }

    private getLoadingType() {
        switch(this.props.type) {
            case 'Fill':
                switch(this.props.color) {
                    case 'Theme':
                        return styles.theme__loading__ffill
                    case 'Red':
                        return styles.red__loading__fill
                    default:
                        return styles.primary__loading__ffill
                }
            case 'Stroke':
                return styles.button__loading__fstroke
        }
    }
}