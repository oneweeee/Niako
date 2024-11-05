import '@gravity-ui/uikit/styles/styles.scss'
import '@gravity-ui/uikit/styles/fonts.scss'

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@gravity-ui/uikit'
import { Component } from 'react';
import './assets/scss/App.scss'

import { Callback, Home, Login, Logout, Servers } from './pages/index';
import { apiUrl, storage } from './config';
import Avatar from './assets/imgs/Avatar.webp';
import locale from './locale'

export default class App extends Component {    
    render() {
        return (
            <ThemeProvider theme={this.state.theme}>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={ <Home width={this.state.width} user={this.state.user} locale={this.state.locale} theme={this.state.theme} setTheme={this.setTheme.bind(this)} setLocale={this.setLocale.bind(this)} cookieAccept={this.state.cookieAccept} acceptCookie={this.acceptCookie.bind(this)} /> } />
                    <Route path='/login' element={ <Login /> } />
                    <Route path='/logout' element={ <Logout /> } />
                    <Route path='/servers' element={ <Servers width={this.state.width} user={this.state.user} locale={this.state.locale} theme={this.state.theme} setTheme={this.setTheme.bind(this)} setLocale={this.setLocale.bind(this)} cookieAccept={this.state.cookieAccept} acceptCookie={this.acceptCookie.bind(this)} /> } />
                    <Route path='/callback' element={ <Callback setUser={this.setUser.bind(this)} /> } />
                </Routes>
            </BrowserRouter>
            </ThemeProvider>
        )
    }

    async componentDidMount() {
        this.initCookie()
        await this.fetchUser()
        window.addEventListener('resize', () => {
            this.setState({ width: window.innerWidth })
        })
    }

    initCookie() {
        const data = localStorage.getItem('app')
        if(!data) {
            return localStorage.setItem(
                'app', JSON.stringify({
                    theme: storage.theme, cookieAccept: false,
                    locale: storage.locale, user: null
                })
            )
        } else {
            const parse = JSON.parse(data)
            locale.changeLanguage(parse.locale)
            if(parse?.user) {
                parse.user.avatar = this.getImage(parse.user, 'avatars')
                parse.user.banner = this.getImage(parse.user, 'banners')
            }
            return this.setState({ ...parse })
        }
    }

    async fetchUser() {
        const res = localStorage.getItem('app')
        if(!res) return

        const parse = JSON.parse(res)
        if(!parse?.user) return

        if(parse.user?.lastUpdate && ((60 * 1000 * 60) + parse.user.lastUpdate) > Date.now()) {
            return
        }

        const token = parse.user.token

        return (await fetch(`${apiUrl}/private/user/token`, {
            method: 'Put',
            headers: {
                'Authorization': token,
                'Content-type': 'application/json'
            },
            body: JSON.stringify(parse.user)
        }).then(async (res) => {
            const data = await res.json()
            if(!data?.ok) {
                parse.user = null
                localStorage.setItem('app', JSON.stringify(parse))
                return this.setState({ user: null })
            }

            parse.user = data.result
            parse.user.avatar = this.getImage(parse.user, 'avatars')
            parse.user.banner = this.getImage(parse.user, 'banners')
            parse.user.lastUpdate = Date.now()
            localStorage.setItem('app', JSON.stringify(parse))
            return this.setState({ user: parse.user })
        }))
    }

    acceptCookie() {
        const res = localStorage.getItem('app')
        if(!res) return

        let parse = JSON.parse(res)
        parse.cookieAccept = true
        localStorage.setItem('app', JSON.stringify(parse))

        return this.setState({ cookieAccept: true })
    }

    setLocale(value) {
        const res = localStorage.getItem('app')
        if(!res || !value) return

        locale.changeLanguage(value)

        let parse = JSON.parse(res)
        parse.locale = value
        localStorage.setItem('app', JSON.stringify(parse))

        return this.setState({ locale: value })
    }

    setTheme(e, value) {
        const res = localStorage.getItem('app')
        if(!res) return

        let parse = JSON.parse(res)

        const theme = !value ? (parse.theme === 'light-hc' ? 'dark-hc' : 'light-hc') : value
        parse.theme = theme
        localStorage.setItem('app', JSON.stringify(parse))

        return this.setState({ theme })
    }

    getImage(user, path) {
        const get = path === 'avatars' ? user.avatar : user.banner
        if(!get && path === 'avatars') return Avatar
        if(!get) return ''
        if(get.startsWith('https')) return get
        
        return `https://cdn.discordapp.com/${path}/${user.id}/${get}.${get.startsWith('a_') ? 'gif' : 'png'}?size=4096`
    }

    setUser(user) {
        return this.setState({ user })
    }

    state = {
        width: window.innerWidth, theme: storage.theme, cookieAccept: false, locale: storage.locale, user: null
    }
}