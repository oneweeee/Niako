import { Component } from "react";
import styles from './SwitcherButtons.module.scss'

export class SwitcherButtons extends Component<{ currencyButton: string, buttons: { label: string, value: string, iconStroke?: any, iconFill?: any }[], onClick: (v: string) => any }> {
    render() {
        return (
            <div className={styles.buttons}>
                {
                    this.props.buttons.map((b) => {
                        return (
                            <div key={b.value} className={`${styles.button} ${b.value === this.props.currencyButton ? styles.buttonCurrency : ''}`} onClick={this.props.onClick.bind(this, b.value)}>
                                { b?.iconFill && b?.iconStroke ? b.value === this.props.currencyButton ? <b.iconFill className={styles.icon}/> : <b.iconStroke className={styles.icon}/> : '' }
                                <p className={styles.text}>{b.label}</p>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}