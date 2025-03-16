import { Component } from "react";
import { Switcher } from "../../../../../components/Switcher/Switcher";
import styles from './AuditTop.module.scss'

import { ReactComponent as IconPower } from '../../../../../assets/svg/PowerFill.svg'
import { Skeletone } from "../../../../../components/Skeletone/Skeletone";

export class AuditTop extends Component<{ isLoading?: boolean, state: boolean, onChangeState: () => any }> {
    render() {
        if(this.props.isLoading) {
            return (
                <Skeletone className={styles.top} type='dropdown' style={{ border: 0, borderRadius: '0px 0px 16px 16px' }} />
            )
        }

        return (
            <div className={styles.top}>
                <div className={styles.title}>
                    <IconPower className={styles.icon} />
                    <p className={styles.text}>Включить аудит</p>
                </div>
                <Switcher state={this.props.state} onChange={this.props.onChangeState.bind(this)} />
            </div>
        )
    }
}