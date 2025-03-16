import { Component } from "react";
import styles from './Buttons.module.scss'

export class Buttons extends Component<{ buttons: { label?: string, value?: string, fillIcon?: any, strokeIcon?: any, currency?: boolean, onClick: Function, onMouseDown?: Function, onMouseUp?: Function }[] }> {
    render() {
        return (
            <div className={styles.buttons}>
                {
                    this.props.buttons.map((b, i) => {
                        return (
                            <div key={i} id={`${b?.value}.${String(i)}`} className={`${styles.button} ${b?.currency ? styles.currency : ''}`} onClick={b.onClick.bind(this)} onMouseDown={b.onMouseDown?.bind(this)} onMouseUp={b.onMouseUp?.bind(this)}>
                                {
                                    b?.strokeIcon ? b?.currency && b?.fillIcon ? <b.fillIcon id={`${b?.value}.${String(i)}`} className={styles.icon}/> : <b.strokeIcon className={styles.icon} id={`${b?.value}.${String(i)}`} /> : ''
                                }
                                { b?.label && <p id={`${b?.value}.${String(i)}`} className={styles.label}>{b.label}</p> }
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}
