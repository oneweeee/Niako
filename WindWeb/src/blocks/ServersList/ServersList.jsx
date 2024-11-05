import { Component } from "react";
import { withTranslation } from "react-i18next";
import { ServerCard } from "../../components";
import styles from './ServersList.module.scss'

class ServersList extends Component {
    render() {
        return (
            <section className={styles.section}>
                <p className={styles.text}>{this.props.title}</p>
                <div className={styles.servers}>
                    {
                        this.props.servers.map((s, i) => <ServerCard key={i} data={s} setFavoriteState={this.props.setFavoriteState} />)
                    }
                </div>
            </section>
        )
    }
}

export default withTranslation()(ServersList)