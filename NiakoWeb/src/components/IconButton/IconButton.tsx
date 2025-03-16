import { Component } from "react";
import styles from './IconButton.module.scss'

export class IconButton extends Component<{ className?: any, ref?: any, style?: any, noFill?: boolean, icon: any, onClick?: (type?: any) => any, useBig?: boolean, useMini?: boolean }> {
    render() {
        return (
            <div ref={this.props.ref} style={this.props.style} className={`${styles.button} ${this.props?.className} ${this.props?.useBig ? '' : this.props?.useMini ? styles.mini : styles.adaptive}`} onClick={this.props.onClick}>
                { <this.props.icon className={this.props?.noFill ? '' : styles.icon}/> }
            </div>
        )
    }
}