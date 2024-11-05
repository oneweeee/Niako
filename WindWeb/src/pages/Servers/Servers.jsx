import { Component } from "react";
import { ServersList } from "../../blocks";
import { Footer, Header } from "../../components";
import styles from "./Servers.module.scss";
import ServersTop from "../../blocks/ServersTop/ServersTop";

class Servers extends Component {
    state = { guilds: null, favoriteGuilds: [], input: '', isLoading: true }

    render() {
        let guilds = this.state.guilds || []
        if(this.state.input && this.state.guilds) {
            guilds = guilds.filter((g) => !this.state.input.toLowerCase().split().some((a) => !g.name.toLowerCase().includes(a)))
        }

        const favoriteGuilds = guilds?.length ? guilds.filter((g) => this.state.favoriteGuilds.includes(g.id)) : []
        return (
            <div className={styles.app}>
                <Header width={this.props.width} theme={this.props.theme} user={this.props.user} setAccepCookie={this.props.acceptCookie} acceptCookie={this.props.cookieAccept} locale={this.props.locale} setLocale={this.props.setLocale} setTheme={this.props.setTheme} />
                <div className={styles.content}>
                    <ServersTop input={this.state.input} guilds={this.state.guilds} clearInput={this.clearInput.bind(this)} setInput={this.setInput.bind(this)} />
                    <div className={styles.lists}>
                        {
                            this.state.isLoading && <ServersList title='Все' setFavoriteState={this.setFavoriteState.bind(this)} servers={
                                new Array(4).fill(null).map((g) => null)
                            } />
                        }
                        {
                            !this.state.isLoading && !guilds.length && (
                                <div className={styles.text}>По указанному запросу ничего не найдено ¯\_(ツ)_/¯</div>
                            )
                        }
                        {
                            favoriteGuilds.length > 0 &&
                            <ServersList title='Избранные' setFavoriteState={this.setFavoriteState.bind(this)} servers={
                                favoriteGuilds.map((g) => ({ ...g, isFavorite: true }))
                            } />
                        }
                        {
                            this.state?.guilds?.length && guilds.length > 0 &&
                            <ServersList title='Все' setFavoriteState={this.setFavoriteState.bind(this)} servers={
                                guilds.sort(
                                    (a, b) => this.getActiveIndex(b) - this.getActiveIndex(a)
                                ).filter((g) => !this.getFavoriteIndex(g))
                            } />
                        }
                    </div>
                </div>
                <div style={{flex: '1'}}></div>
                <Footer theme={this.props.theme}/>
            </div>
        )
    }

    async componentDidMount() {
        window.scrollTo({ top: 0 })
        
        const item = localStorage.getItem('app')
        if(!item) return this.locationToOrigin()

        const favoriteGuilds = JSON.parse(item)?.user?.favoriteGuilds || []

        const token = JSON.parse(item)?.user?.token
        if(!token) return this.locationToOrigin()

        const servers = await fetch('https://api.wind-bot.xyz/private/guilds/user', {
            headers: { 'Authorization': token }
        }).then(async (r) => await r.json()).catch(() => ({ ok: false }))

        if(!servers?.ok) return this.locationToOrigin()

        return this.setState({ guilds: servers.result, favoriteGuilds, isLoading: false })
    }

    setInput(e) {
        return this.setState({ input: e?.target?.value || '' })
    }

    clearInput() {
        const el = document.getElementById('inputServerName')
        if(el) {
            el.value = ''
        }

        console.log(el.value)

        return this.setState({ input: '' })
    }

    async setFavoriteState(guild) {
        const item = localStorage.getItem('app')
        if(!item) return this.locationToOrigin()

        const token = JSON.parse(item)?.user?.token
        if(!token) return this.locationToOrigin()

        const data = JSON.parse(item)

        const favorite = await fetch(
            `https://api.wind-bot.xyz/private/guild/user/favorite?guildId=${guild.id}`,
            { method: 'Post', headers: { 'Authorization': token } }
        ).then(async (r) => await r.json()).catch(() => ({ ok: false }))

        if(favorite?.ok) {
            if(!favorite.result.state && this.state.favoriteGuilds.includes(guild.id)) {
                const favoriteGuilds = structuredClone(this.state.favoriteGuilds)
                favoriteGuilds.splice(favoriteGuilds.indexOf(guild.id), 1)
    
                data.user.favoriteGuilds = favoriteGuilds
                localStorage.setItem('app', JSON.stringify(data))
    
                return this.setState({ favoriteGuilds })
            } else if(favorite.result.state && !this.state.favoriteGuilds.includes(guild.id)) {
                const favoriteGuilds = structuredClone(this.state.favoriteGuilds)
                favoriteGuilds.push(guild.id)
    
                if(!data?.user?.favoriteGuilds) {
                    data.user.favoriteGuilds = []
                }
    
                data.user.favoriteGuilds = favoriteGuilds
                localStorage.setItem('app', JSON.stringify(data))
    
                return this.setState({ favoriteGuilds })
            }
        }
    }

    locationToOrigin() {
        return window.location.href = window.location.origin
    }

    getActiveIndex(g) {
        return g.has ? 1 : 0
    }

    getFavoriteIndex(g) {
        return this.state.favoriteGuilds.includes(g.id) ? 1 : 0
    }
}

export default Servers