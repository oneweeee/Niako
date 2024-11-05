import { Component } from "react";
import { withTranslation } from "react-i18next";
import { Button } from "@gravity-ui/uikit";
import { Divider } from "../../components";
import { links } from "../../config";
import styles from './HomeInvite.module.scss'

class HomeInvite extends Component {
    render() {
        return (
            <section className={styles.section}>
                <Divider />
                <Button view='action' size='xl' target='_blank' href={links.botInvite}>Пригласить бота</Button>
                <Divider />
            </section>
        )
    }
}

export default withTranslation()(HomeInvite)