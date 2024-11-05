import { Component } from "react";
import { withTranslation } from "react-i18next";
import { Button } from "@gravity-ui/uikit";
import { links } from "../../config";
import styles from './HomeHeader.module.scss'

class HomeHeader extends Component {
    render() {
        return (
            <section className={styles.section}>
                <div className={styles.content}>
                    <p className={styles.title}>Wind - Гибко настраиваемый бот для Discord!</p>
                    <p className={styles.description}>Многофункциональный бот с такими модулями, как модерация сервера, защита, антирейд, логи, музыка и не только!</p>
                </div>
                <div className={styles.buttons}>
                    <Button view='action' size='xl' target='_blank' href={links.botInvite} width={this.props.width > 540 ? 'auto' : 'max'}>Пригласить бота</Button>
                    <Button view='outlined' size='xl' width={this.props.width > 540 ? 'auto' : 'max'} onClick={this.onClickScroll.bind(this)}>Узнать больше</Button>
                </div>
            </section>
        )
    }

    onClickScroll() {
        const el = document.getElementById('sectionHomeInfo')
        if(!el) return

        return window.scrollTo({ top: (el.offsetTop - 90) })
    }
}

export default withTranslation()(HomeHeader)