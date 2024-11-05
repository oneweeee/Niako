import { Component } from "react";
import { getBrowser, razbitNumber, roundNumber } from "../../util";
import { GuildCard } from "../../components";
import { apiUrl } from "../../config";
import styles from './HomeGuilds.module.scss'

class HomeGuilds extends Component {
    render() {
        const isSafari = ['safari'].includes(getBrowser())
        return (
            <section className={styles.section}>
                <p className={styles.title}>Нам доверяют и используют более {this.getTotalGuilds()} серверов</p>
                <div className={styles.guilds}>
                    {
                        new Array(2).fill(null).map((_, i) => (
                            <div key={i} className={`${styles.rows} ${isSafari ? styles.safariRows : ''}`}>
                                { this.renderRow(i, isSafari ? (this.props.width > 1122 || 842 > this.props.width ? 8 : 6) : 16, isSafari) }
                                { isSafari ? '' : this.renderRow(i, 16, isSafari) }
                            </div>
                        ))
                    }
                </div>
            </section>
        )
    }

    renderRow(column, size, isSafari) {
        const start = column === 0 ? 0 : size / 2
        const end = column === 0 ? size / 2 : size
        return (
            <div className={`${styles.row} ${isSafari ? styles.safari : (column === 0 ? styles.left : styles.right)}`}>
                {
                    (
                        this.state.guilds.length === 0 ? new Array(size).fill(null) : this.state.guilds.slice(start, end)
                    ).map((g, i) => <GuildCard key={i} width={this.props.width} guild={g} />)
                }
            </div>
        )
    }

    async componentDidMount() {
        const response = await fetch(
            `${apiUrl}/public/top-guilds`
        ).then(
            async (res) => await res.json()
        ).catch(() => ({ ok: false }))

        if(!response?.ok) return

        return this.setState({ ...response.result })
    }

    getTotalGuilds() {
        if(this.state.totalGuilds === 0) {
            return <span className={`${styles.brand} ${styles.loading}`}>...</span>
        }

        return <span className={styles.brand}>{razbitNumber(roundNumber(this.state.totalGuilds))}</span>
    }

    state = { totalGuilds: 0, totalUsers: 0, guilds: [] }
}

export default HomeGuilds