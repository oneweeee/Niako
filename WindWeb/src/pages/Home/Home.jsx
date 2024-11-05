import { Component } from "react";
import { HomeGuilds, HomeHeader, HomeInfo, HomeInvite } from "../../blocks";
import { Header, CookieAlert, Footer } from "../../components";
import styles from './Home.module.scss'

class Home extends Component {
    render() {
        return (
            <div className={styles.app}>
                <Header width={this.props.width} theme={this.props.theme} user={this.props.user} setAccepCookie={this.props.acceptCookie} acceptCookie={this.props.cookieAccept} locale={this.props.locale} setLocale={this.props.setLocale} setTheme={this.props.setTheme} />
                <HomeHeader width={this.props.width} />
                <HomeInfo />
                <HomeGuilds width={this.props.width} />
                <HomeInvite />
                { !this.props.cookieAccept && <CookieAlert acceptCookie={this.props.acceptCookie} /> }
                <Footer theme={this.props.theme}/>
            </div>
        )
    }

    componentDidMount() {
        window.scrollTo({ top: 0 })
    }
}

export default Home