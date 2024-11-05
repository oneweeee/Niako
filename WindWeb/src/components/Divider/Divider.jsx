import { Component } from "react";
import styles from './Divider.module.scss';

class Divider extends Component {
    render() {
        return (
            <span className={styles.divider}></span>
        )
    }
}

export default Divider