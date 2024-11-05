import { Component } from "react";
import { withTranslation } from "react-i18next";
import { Alert } from "@gravity-ui/uikit";
import { links } from "../../config";
import styles from './CookieAlert.module.scss'

class CookieAlert extends Component {
    state = { onClose: false }

    render() {
        return (
            <Alert
            className={`${styles.cookie} ${this.state.onClose ? styles.onClose : ''}`} theme='info' title={this.props.t('pages.main.cookie.title')}
            message={this.props.t('pages.main.cookie.message')}
            onClose={this.handlerClose.bind(this, false)}
            actions={
                [
                    {
                        text: this.props.t('pages.main.cookie.okay'),
                        handler: this.handlerClose.bind(this, true)
                    },
                    {
                        text: this.props.t('pages.main.cookie.readMore'),
                        handler: this.handlerMore.bind(this)
                    }
                ]
            }
            />
        )
    }

    handlerClose(state) {
        this.setState({ onClose: true })
        if(state) setTimeout(() => this.props.acceptCookie(), 800)
    }

    handlerMore() {
        return window.location.href = links.cookie
    }
}

export default withTranslation()(CookieAlert)