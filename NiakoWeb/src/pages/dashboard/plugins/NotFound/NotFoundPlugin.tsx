import { Component } from 'react';
import styles from './NotFoundPlugin.module.scss'

export default class NotFoundPlugin extends Component<{ currecyGuildId: string, page: string, setGuildState: (state: boolean) => any }, { currecyGuildId: string, page: string }> {
    state = {
        currecyGuildId: this.props.currecyGuildId,
        page: this.props.page
    }

    render() {
        return (
            <div className={styles.content}>
                <p className={styles.title}>Плагин «{this.props.page}» не найден!</p>
                <div className={styles.description}>
                    <p className={styles.text}>Мы скоро добавим данный плагин с новыми обновлениями!</p>
                </div>
            </div>
        )
    }

    componentDidMount() {
        return this.props.setGuildState(true)
    }

    componentDidUpdate() {
        if(this.props.page !== this.state.page || this.props.currecyGuildId !== this.state.currecyGuildId) {
            this.setState({ page: this.props.page, currecyGuildId: this.props.currecyGuildId })
            return this.props.setGuildState(true)
        }
    }
}