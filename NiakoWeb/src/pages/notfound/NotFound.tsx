import { Component } from "react";
import styles from './NotFound.module.scss'
import { Button } from "../../components/Button/Button";

export class NotFound extends Component {
    render() {
        return (
            <div className={styles.notfound_content}>
                <p className={styles.title}>404</p>
                <div className={styles.description}>
                    <p className={styles.text}>Попробуйте вернуться назад или поищите что-нибудь другое</p>
                    <Button alignSelf='stretch' content="На главную" type='Fill' color='Primary' onClick={() => window.location.href = window.location.origin} />
                </div>
            </div>
        )
    }
}