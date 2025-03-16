import { Component } from "react";
import styles from './Switcher.module.scss'

export class Switcher extends Component<{ disbaled?: boolean, state: boolean, onChange: (e?: any) => any, id?: string }> {
    render() {
        return (
            <label className={styles.switcher}>
                <input id={this.props.id} type='checkbox' className={`${styles.input} ${this.props.disbaled ? styles.disableInput : ''}`} checked={this.props.state} onChange={this.props?.disbaled ? undefined : this.props.onChange}/>
                <span className={`${styles.slider} ${this.props.disbaled ? styles.disableSlider : ''}`}></span>
            </label>
        )
    }
}