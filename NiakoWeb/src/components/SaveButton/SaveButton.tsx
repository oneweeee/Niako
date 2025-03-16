import { CircularProgress } from "@mui/material";
import { Component } from "react";
import styles from './SaveButton.module.scss'

import { ReactComponent as IconCheck } from '../../assets/svg/Check.svg';

export class SaveButton extends Component<{ loading?: boolean, show: boolean | null, onClick: () => any }, { show: boolean }> {
    state = { show: null as any }

    render() {
        return (
            <div
            className={
                `${styles.button} ${typeof this.state.show === 'boolean' ? (this.state.show ? styles.show : styles.hide) : styles.close} ${this.props.loading ? styles.loading : ''}`
            }
            onClick={this.state.show && !this.props.loading ? this.props.onClick.bind(this) : undefined}
            >
                { this.props.loading ? <CircularProgress size={24} className={styles.loader} />  : <IconCheck className={styles.icon} />}
            </div>
        )
    }

    componentDidUpdate(props: any) {
        if (props.show !== this.props.show) {
            this.setState({ show: typeof this.props.show === 'boolean' ? (this.props.show ? true : false) : null as any })
        }
    }
}