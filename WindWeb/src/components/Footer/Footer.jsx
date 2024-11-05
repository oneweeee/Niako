import { Component } from "react";
import { Link as GLink } from "@gravity-ui/uikit";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Logo } from "../index";
import { links } from "../../config";
import styles from './Footer.module.scss'

class Footer extends Component {
    render() {
        return (
            <footer className={`${styles.footer} ${this.props?.absolute ? styles.absolute : ''}`}>
                <div className={styles.top}>
                    <div className={styles.links}>
                        { this.state.links.map((item, i) => {
                            return (
                                <div key={i} className={styles.group}>
                                    <p className={styles.title}>{this.props.t(item.title)}</p>
                                    <div className={styles.childs}>
                                        {
                                            item.childs.map(
                                                (l) => (
                                                <Link className={styles.title} key={l.value} to={l.value} target={l?.target}>
                                                    <GLink view='secondary'>
                                                        {this.props.t(l.title)}
                                                    </GLink>
                                                </Link>
                                                )
                                            )
                                        }
                                    </div>
                                </div>
                            )
                        }) }
                    </div>
                    <Logo theme={this.props.theme}/>
                </div>
                <div className={styles.bottom}>
                    <p className={styles.text}>© {new Date().getFullYear()} «Wind»</p>
                    <p className={styles.text}>Wind не имеет аффилированных отношений с компанией Discord Inc</p>
                </div>
            </footer>
        )
    }

    state = {
        links: [
            {
                title: 'Помощь',
                childs: [
                    {
                        title: 'footer.stats',
                        value: links.stats
                    },
                    {
                        title: 'Документация',
                        value: links.documentation,
                        target: '_mblank'
                    },
                    {
                        title: 'Список команд',
                        value: links.commands
                    }
                ]
            },
            {
                title: 'Поддержка',
                childs: [
                    {
                        title: 'Сервер сообщества',
                        value: links.support,
                        target: '_mblank'
                    },
                    {
                        title: 'Спонсорство',
                        value: links.donate
                    }
                ]
            },
            {
                title: 'Правовая информация',
                childs: [
                    {
                        title: 'Политика конфиденциальности',
                        value: links.private
                    },
                    {
                        title: 'Уведомление о конфиденциальности',
                        value: links.police
                    },
                    {
                        title: 'Политика использования файлов Cookie',
                        value: links.cookie
                    }
                ]
            }
        ]
    }
}

export default withTranslation()(Footer)