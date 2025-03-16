import { Component } from "react";
import styles from './Snow.module.scss'

import { ReactComponent as Snowflake } from '../../assets/svg/Snowflake.svg';

export class Snow extends Component {
    render() {
        return (
            <div className={styles.snowflake}>
                <div className={styles.inner}><Snowflake /></div>
            </div>
        )
    }
}