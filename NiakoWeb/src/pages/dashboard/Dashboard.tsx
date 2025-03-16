import { Component } from 'react';
import { apiUrl } from '../../config'
import { IDashboardOptions } from '../../types/dashboard';
import styles from './Dashboard.module.scss'
import { DashboardHeader } from './components/Header/DashboardHeader';
import { IThemeOptions } from '../../types/theme';
import { DrawerMenu } from './components/DrawerMenu/DrawerMenu';
import Logo from '../../assets/img/Logo-256.png';
import Avatar from '../../assets/img/DefaultAvatar.png';
import NotFoundPlugin from './plugins/NotFound/NotFoundPlugin';
import { Snow } from '../../components/Snow/Snow';
import { Button } from '../../components/Button/Button';

export class Dashboard extends Component<IThemeOptions, IDashboardOptions> {
    fatcs = [ 
        'Что Tenderly был продан за 100 рублей',
        'Что Desires был самым востребованным ботом в Discord',
        'Что на AVENUE владельцем был не настоящий lil17th',
        'Что META когда-то была XIVIVIDE',
        'Что Haku не открылся из-за Niako',
        'Что видео с AlanGostik про Niako мы делали 2 часа ночью',
        'Что Discord хранит более триллионов сообщений',
        'Что Вы можете зайти на сервер поддержки Niako',
        'Что Niako уже 2 года, но развитие начали только в летом 2023',
        'Что дата создания Niako совпадает с датой создания Discord'
    ]

    state = {
        user: {} as any,
        guilds: [],
        loading: true,
        openMenu: null as any,
        currecyGuildId: '0',
        plugin: undefined as any,
        canSave: false,
        guildState: true,
        errors: [] as string[],
        selectFact: this.random(0, this.fatcs.length-1),
        fonts: [
            'Comic-Helvetic.otf',
            'Edo-SZ-HQ.ttf',
            'EFNMacStyle8px.ttf',
            'Geometria-Medium.ttf',
            'Geometria.otf',
            'Gilroy-Medium.ttf',
            'Gilroy-SemiBold.ttf',
            'Gilroy.ttf',
            'GothamSSm.otf',
            'Inter-Medium.otf',
            'Inter-Semi-Bold.otf',
            'Inter.otf',
            'Intro-Demo-Black-CAPS.otf',
            'Karmilla.ttf',
            'Made-in-China.TTF',
            'Minecraft-Ten-v2.ttf',
            'Minecraft-Ten.ttf',
            'Minima-Expanded-SSi.ttf',
            'Montserrat-Medium.ttf',
            'Montserrat-SemiBold.ttf',
            'Montserrat.ttf',
            'Noto-Sans.ttf',
            'ObelixPro.ttf',
            'Proxima-Nova-Bl.otf',
            'Proxima-Nova-Rg.otf',
            'Russisch-Sans.ttf',
            'Spaceland-en.otf',
            'Stolzl-Bold.otf',
            'Stolzl-Medium.otf',
            'Stolzl.otf'
        ]
    }

    render() {
        if(this.state.loading) {
                return (
                <div className={styles.loading_wrapper}>
                    <div className={styles.logo}>
                        <img className={styles.logo} src={Logo} alt='Niako' />
                    </div>
                    <div className={styles.content}>
                        <div className={styles.facts}>
                            <p className={styles.title}>А вы знали?</p>
                            <p className={styles.description}>{this.fatcs[this.state.selectFact]}</p>
                        </div>
                        <div className={styles.line}></div>
                    </div>
                </div>
            )
        }

        if(this.state.currecyGuildId === '0') {
            return (
                <div className={styles.noserver_content}>
                    <p className={styles.title}>Ой! Что-то не так...</p>
                    <div className={styles.description}>
                        <p className={styles.text}>У вас, <span className={styles.user}><img className={styles.avatar} src={this.state.user.avatar} alt='Avatar'></img><span className={styles.bold}>{this.state.user.username}</span>,</span> ещё нет ни одного сервера с Niako :(</p>
                        <div className={styles.buttons}>
                            <Button className={styles.button} content='Пригласить на сервер' type='Fill' href='https://discord.com/api/oauth2/authorize?client_id=842425623754702868&permissions=8&scope=bot%20applications.commands' />
                            <Button className={styles.button} content='Выйти с аккаунта' type='Fill' color='Red' href='/logout' />
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className={styles.app_wrapper}>
                <DashboardHeader state={this.state.openMenu} page={this.state.plugin?.title || 'Не выбран'} setOpenMenu={this.setOpenMenu.bind(this, this.state.openMenu)} theme={this.props.theme} />
                <DrawerMenu fonts={this.state.fonts} setCurrencyGuild={this.setCurrencyGuild.bind(this)} setPlugin={this.setPlugin.bind(this)} guildState={this.state.guildState}
                openMenu={this.state.openMenu} setOpenMenu={this.setOpenMenu.bind(this, this.state.openMenu)} plugin={this.state.plugin}
                user={this.state.user} guilds={this.state.guilds} currecyGuildId={this.state.currecyGuildId} setGuildState={this.setGuildState.bind(this)}
                />
                <div className={styles.plugin} id='dashboardPlugin'>
                    {
                        this.state.plugin?.component ? <this.state.plugin.component fonts={this.state.fonts} sendError={this.sendError.bind(this)} currecyGuildId={this.state.currecyGuildId} setGuildState={this.setGuildState.bind(this)} />
                        : <NotFoundPlugin currecyGuildId={this.state.currecyGuildId} setGuildState={this.setGuildState.bind(this)} page={this.state.plugin?.title || 'Unknown'} />}
                </div>
                <div className={styles.errors}>
                    { this.state.errors.slice(0, 3).map((message, i) =>{
                        return (
                            <div className={styles.snackbar} key={i}>
                                <div className={styles.content}>
                                    <p className={styles.text}>{message}</p>
                                </div>
                                <div className={styles.line}></div>
                            </div>
                        )
                    }) }
                </div>
                <div>
                    { /* new Array(12).fill(null).map((_, i) => <Snow key={i} />) */ }
                </div>
            </div>
        )
    }

    async componentDidMount() {
        const get = JSON.parse(localStorage.getItem('niako') || '{}')?.currentUser
        if(!get) return this.locationToOrigin()

        const response = await fetch(`${apiUrl}/private/user/guilds`, {
            headers: {
                'Authorization': get.token
            }
        }).then(async (res) => await res.json()).catch(() => ({ status: false, message: 'error' }))

        if(!response.status) return this.locationToOrigin(['Invalid auth token', '401: Unauthorized'].includes(response.message))

        const guilds = response.answer.guilds.filter((g: any) => g.has)

        if(guilds.length > 0) {
            this.setState({
                currecyGuildId: guilds[0].id
            })
        }

        setTimeout(() => this.setState({ guilds, loading: false }), 1000)

        const currentUser = JSON.parse(localStorage.getItem('niako') || '{}')?.currentUser
        if(currentUser && currentUser?.avatar) {
            this.setState({
                user: {
                    ...currentUser,
                    avatar: `https://cdn.discordapp.com/avatars/${currentUser.id}/${currentUser.avatar}${currentUser.avatar.startsWith('a_') ? `.gif` : `.png`}?size=4096`
                }
            })
        } else {
            this.setState({
                user: {
                    ...currentUser,
                    avatar: Avatar
                }
            })
        }

        for ( let i = 0; this.state.fonts.length > i; i++ ) {
            const name = this.state.fonts[i]
            var f = new FontFace(name.split('.')[0].split('-').join(' '), `url(/fonts/${name})`);
            await f.load().then((font) => document.fonts.add(font))
        }
    }

    sendError(message: string) {
        if(this.state.errors.includes(message)) return
        
        setTimeout(() => {
            this.state.errors.splice(this.state.errors.indexOf(message), 1)
            return this.setState({ errors: this.state.errors })
        }, 2100)

        this.state.errors.push(message)

        return this.setState({ errors: this.state.errors })
    }

    setOpenMenu(state: boolean) {
        const body = document.getElementById('body')
        const drawermenu = document.getElementById('drawermenu')
        if(body) {
            if(!state) {
                const top = window.scrollY
                body.style.position = 'fixed'
                body.style.overflow = 'hidden'
                body.style.top = `-${top}px`
                body.style.width = '100%'
                body.style.height = '100%'
                if(drawermenu) {
                    drawermenu.style.top = '0px'
                }
            } else {
                body.style.position = 'unset'
                body.style.overflow = 'auto'
                body.style.width = 'unset'
                window.scrollTo({ top: parseInt(body.style.top)*-1 })
                body.style.top = '0px'
                body.style.height = 'unset'
            }
        }
        return this.setState({ openMenu: !state })
    }

    setCurrencyGuild(guildId: string) {
        return this.setState({ currecyGuildId: guildId })
    }

    setPlugin(plugin: any) {
        return this.setState({ plugin: plugin })
    }

    setGuildState(state: boolean) {
        return this.setState({ guildState: state })
    }

    private locationToOrigin(updateUser: boolean = false) {
        if(updateUser) {
            const item = localStorage.getItem('niako')
            if(item) {
                const json = JSON.parse(item)
                json.currentUser = null
                localStorage.setItem('niako', JSON.stringify(json))
            }
        }

        return window.location.href = window.location.origin
    }

    private random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
}