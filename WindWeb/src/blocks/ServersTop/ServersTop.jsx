import { Component } from "react";
import { withTranslation } from "react-i18next";
import { Icon, TextInput } from "@gravity-ui/uikit";
import { Magnifier, Xmark } from '@gravity-ui/icons';
import styles from './ServersTop.module.scss'

class ServersTop extends Component {
    render() {
        return (
            <section className={styles.section}>
                <div className={styles.title}>
                    <p>
                        Всего серверов <span className={!this.props?.guilds ? styles.opacity : ''}>
                            {this.props?.guilds ? this.props.guilds?.length || 0 : '...' }
                        </span>
                    </p>
                </div>
                <TextInput
                id='inputServerName'
                disabled={!this.props?.guilds}
                placeholder="Поиск сервера..."
                leftContent={<Icon className={styles.icon} size={18} data={Magnifier} />}
                rightContent={this.props?.input ? <div className={styles.clear} onClick={this.props.clearInput.bind(this)}><Icon data={Xmark}/></div> : undefined}
                size='xl'
                onChange={this.props.setInput.bind(this)}
                />
            </section>
        )
    }
}

export default withTranslation()(ServersTop)