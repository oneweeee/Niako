import { Component } from "react";
import styles from './Lightrope.module.scss'

export class Lightrope extends Component {
    render() {
        return (
            <div className={styles.lightrope}>
                {
                    new Array(100).fill(null).map((_, i) => <li key={i}></li>)
                }
            </div>
        )
    }
}