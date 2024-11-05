import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { links } from '../../config';
import styles from './Header.module.scss';
import { Divider, Logo } from "../index";
import { Component, createRef } from "react";
import {
    Button,
    Icon,
    DropdownMenu,
    Modal,
    Link as GLink,
} from "@gravity-ui/uikit";
import {
    Globe,
    Moon,
    Sun,
    Check,
    Bars,
    BookOpen,
    TerminalLine,
    Xmark,
    ChartAreaStackedNormalized,
    Heart,
    EllipsisVertical,
    ArrowRightToSquare,
    ArrowRightFromSquare,
    Comments,
    Compass,
    ChevronRight,
} from '@gravity-ui/icons';

class Header extends Component {
    render() {
        if(760 > this.props.width) {
            return (
                <header id='header' className={`${styles.header} ${this.props?.noUseAnimation ? '' : styles.animation} ${this.state.isScroll ? styles.scrolling : ''}`} ref={this.state.ref}>
                    <Modal open={this.state.openModal} onClose={this.onShowModal.bind(this, false, false)}>
                        <div className={styles.modal}>
                            <div className={styles.cookieTitle}>
                                <p>{this.props.t('pages.main.cookie.files')}</p>
                                <Button view='flat' onClick={this.onShowModal.bind(this, false, false)}><Icon data={Xmark} size={16}/></Button>
                            </div>
                            <p>{this.props.t('pages.main.cookie.accept')} <Link to='/cookie'><GLink view='normal'>{this.props.t('pages.main.cookie.accept_files')}</GLink></Link>, {this.props.t('pages.main.cookie.accept_login')}</p>
                            <div className={styles.buttons}>
                                <Button view='action' width='max' onClick={this.onShowModal.bind(this, false, true)}>{this.props.t('pages.main.header.accept_login')}</Button>
                                <Button view='normal' width='max' onClick={this.onShowModal.bind(this, false, false)}>{this.props.t('pages.main.header.reject')}</Button>
                            </div>
                        </div>
                    </Modal>
                    <div className={styles.content}>
                        <Button view='flat' size='l' onClick={this.onClickBards.bind(this)}>
                            <Icon data={Bars} size={16}/>
                        </Button>
                        <Link to='/'><Logo theme={this.props.theme}/></Link>
                        {
                            !this.props?.user ? (
                                <Button view='flat' size='l' onClick={this.onClickEllipsis.bind(this)}>
                                    <Icon data={EllipsisVertical} size={16}/>
                                </Button>
                            ) : <img className={styles.avatar} alt='Avatar' onClick={this.onClickEllipsis.bind(this)} src={this.props.user.avatar.replace('4096', '96')}/>
                        }
                    </div>
                    {
                        !this.state?.openBards ? '' : (
                            <div className={styles.drop}>
                                <div className={styles.container}>
                                    {
                                        this.state.links.slice(0, this.state.links.length-1).map(
                                            (d, i) => (
                                                <Link to={d.href} key={i} style={{ width: '100%' }}>
                                                    <Button className={styles.button} view='flat' size='l' width='max'>
                                                        { d?.icon && <Icon data={d.icon} size={16}/> }
                                                        { this.props.t(d.label) }
                                                    </Button>
                                                </Link>
                                            )
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }
                    {
                        !this.state?.openEllipsis ? '' : (
                            <div className={styles.drop}>
                                <div className={styles.container}>
                                    {
                                        !this.props?.user ? (
                                            <Button className={styles.button} view='flat' size='l' width='max' href={
                                                this.props.acceptCookie ? links.login : undefined
                                            } onClick={!this.props.acceptCookie ? this.onShowModal.bind(this, true, false) : undefined}>
                                                    <Icon data={ArrowRightToSquare} size={16}/> {this.props.t('pages.main.header.login')}
                                            </Button>
                                        ) : (
                                            <div className={styles.profile}>
                                                <div className={styles.container}>
                                                    { this.props.user?.banner ? <img className={styles.banner} alt='Banner' src={this.props.user.banner.replace('png', 'webp').replace('4096', '512')} /> : <div className={styles.banner}></div> }
                                                    <div className={styles.block}>
                                                        <img className={styles.avatar} alt='Avatar' src={this.props.user.avatar.replace('4096', '96')} />
                                                        <div className={styles.nicknames}>
                                                            <p className={styles.global}>{this.props.user.global_name}</p>
                                                            <p className={styles.username}>@{this.props.user.username}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    <div className={styles.stroke}>
                                        <Divider />
                                    </div>
                                    {
                                        !this.props?.user ? '' : (
                                            <Link to={links.servers} style={{ width: '100%' }}>
                                                <Button className={styles.button} view='flat' size='l' width='max'>
                                                    <Icon data={Compass} size={16}/> {this.props.t('pages.main.header.servers')}
                                                </Button>
                                            </Link>
                                        )
                                    }
                                    <Link to={links.support} style={{ width: '100%' }}>
                                        <Button className={styles.button} view='flat' size='l' width='max'>
                                            <Icon data={Comments} size={16}/> {this.props.t('pages.main.header.help')}
                                        </Button>
                                    </Link>
                                    <Button className={styles.button} view='flat' size='l' width='max' onClick={this.props.setTheme.bind(this)}>
                                        <Icon data={this.props.theme === 'light' ? Moon : Sun} size={16}/>
                                        { this.props.theme === 'light' ? `${this.props.t('pages.main.header.dark_theme')}` : `${this.props.t('pages.main.header.light_theme')}`}
                                    </Button>
                                    <DropdownMenu
                                    size= 'xl'
                                    switcherWrapperClassName={styles.dropdown}
                                    renderSwitcher={(props) => (
                                        <Button {...props} className={styles.button} view='flat' size='l' width='max'>
                                            <Icon data={Globe} size={16}/>
                                            { this.getLocales().find((v) => v.value === this.props.locale)?.label || this.props.locale }
                                            <Icon data={ChevronRight} size={16} />
                                        </Button>
                                    )}
                                    popupProps={{ placement: 'bottom-end', style: { width: '190px' } }}
                                    items={
                                        this.getLocales().map((l) => ({
                                            text: l.label,
                                            key: l.value,
                                            action: this.props.setLocale.bind(this, l.value),
                                            iconStart: l.value === this.props.locale ? <Icon className={styles.brand} data={Check} size={16}/> : <div className={styles.spanIcon}></div>
                                        }))
                                    }
                                    />
                                    {
                                        !this.props?.user ? '' : (
                                            <div className={styles.stroke}>
                                                <Divider />
                                            </div>
                                        )
                                    }
                                    {
                                        !this.props?.user ? '' : (
                                            <Link to={links.logout} style={{ width: '100%' }}>
                                                <Button className={styles.button} view='flat' size='l' width='max'>
                                                    <Icon data={ArrowRightFromSquare} size={16}/> {this.props.t('pages.main.header.logout')}
                                                </Button>
                                            </Link>
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }
                </header>
            )
        }

        return (
            <header className={`${styles.header} ${this.props?.noUseAnimation ? '' : styles.animation}  ${this.state.isScroll ? styles.scrolling : ''}`} ref={this.state.ref}>
                <Modal open={this.state.openModal} onClose={this.onShowModal.bind(this, false, false)}>
                    <div className={styles.modal}>
                        <div className={styles.cookieTitle}>
                            <p>{this.props.t('pages.main.cookie.files')}</p>
                            <Button view='flat' onClick={this.onShowModal.bind(this, false, false)}><Icon data={Xmark} size={16}/></Button>
                        </div>
                        <p>{this.props.t('pages.main.cookie.accept')} <Link to='/cookie'><GLink view='normal'>{this.props.t('pages.main.cookie.accept_files')}</GLink></Link>, {this.props.t('pages.main.cookie.accept_login')}</p>
                        <div className={styles.buttons}>
                            <Button view='action' width='max' onClick={this.onShowModal.bind(this, false, true)}>{this.props.t('pages.main.header.accept_login')}</Button>
                            <Button view='normal' width='max' onClick={this.onShowModal.bind(this, false, false)}>{this.props.t('pages.main.header.reject')}</Button>
                        </div>
                    </div>
                </Modal>
                <div className={styles.content}>
                    <div className={styles.left}>
                        <Link to='/'><Logo theme={this.props.theme}/></Link>
                        {
                            this.state.links.slice(0, this.state.links.length-1).map((d, i) => (
                                <Link to={d.href} key={i} style={{ width: '100%' }}><Button key={i} view='flat' size='l'>{this.props.t(d.label)}</Button></Link>
                            ))
                        }
                    </div>
                    <div className={styles.right}>
                        <DropdownMenu
                        size= 'xl'
                        renderSwitcher={(props) => (
                            <Button {...props} view='outlined' size='l'>
                                <Icon data={Globe} size={16}/>
                            </Button>
                        )}
                        popupProps={{ placement: 'bottom-end', style: { width: '190px' } }}
                        items={
                            this.getLocales().map((l) => ({
                                text: l.label,
                                key: l.value,
                                action: this.props.setLocale.bind(this, l.value),
                                iconStart: l.value === this.props.locale ? <Icon className={styles.brand} data={Check} size={16}/> : <div className={styles.spanIcon}></div>
                            }))
                        }
                        />
                        <Button view='outlined' size='l' onClick={this.props.setTheme.bind(this)}>
                            <Icon data={this.props.theme === 'dark' ? Moon : Sun} size={16}/>
                        </Button>
                        {
                            !this.props?.user ? (
                                <Link to={this.props.acceptCookie ? links.login : undefined}>
                                <Button view='action' size='l' onClick={!this.props.acceptCookie ? this.onShowModal.bind(this, true, false) : undefined}>{this.props.t('pages.main.header.login')}</Button>
                                </Link>
                            ) : (
                                <DropdownMenu
                                size= 'xl'
                                renderSwitcher={(props) => (
                                    <img {...props} className={styles.avatar} alt='Avatar' src={this.props.user.avatar.replace('4096', '96')}/>
                                )}
                                menuProps={{style: { padding: 0 }}}
                                popupProps={{ placement: 'bottom-end', style: { width: '300px', border: 0, borderRadius: '8px', '--yc-popup-border-width': '0px' } }}
                                items={
                                    [
                                        {
                                            style: { padding: 0 },
                                            text: (
                                                <div className={`${styles.dropprofile}`}>
                                                    <div className={styles.container}>
                                                        { this.props.user?.banner ? <img className={styles.banner} alt='Banner' src={this.props.user.banner.replace('png', 'webp').replace('4096', '512')} /> : <div className={styles.banner}></div> }
                                                        <div className={styles.block}>
                                                            <img className={styles.avatar} alt='Avatar' src={this.props.user.avatar.replace('4096', '96')} />
                                                            <div className={styles.nicknames}>
                                                                <p className={styles.global}>{this.props.user.global_name}</p>
                                                                <p className={styles.username}>@{this.props.user.username}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        },
                                        {
                                            text: `${this.props.t('pages.main.header.servers')}`,
                                            href: links.servers,
                                            iconStart: <Icon data={Compass} size={16}/>
                                        },
                                        {
                                            text: `${this.props.t('pages.main.header.help')}`,
                                            href: links.support,
                                            iconStart: <Icon data={Comments} size={16}/>
                                        },
                                        {
                                            text: `${this.props.t('pages.main.header.logout')}`,
                                            href: links.logout,
                                            iconStart: <Icon data={ArrowRightFromSquare} size={16}/>
                                        }
                                    ]
                                }
                                />
                            )
                        }
                    </div>
                </div>
            </header>
        )
    }

    componentDidMount() {
        this.deleteFlow()
        document.onscroll = this.onScrollWindow.bind(this)
    }

    componentDidUpdate(props, state) {
        if((760 > props.width && props.width === this.props.width && state.openModal === this.state.openModal) && ((this.state.openBards && state.openBards) || (this.state.openEllipsis && state.openEllipsis))) {
            this.deleteFlow()
            return this.setState({ openBards: false, openEllipsis: false })
        }

        if(props.width >= 760 && props.width !== this.props.width) {
            return this.deleteFlow()
        }
    }

    onShowModal(openModal, cookie) {
        if(cookie) {
            this.props.setAccepCookie()
            setTimeout(() => { window.location.href = '/login' }, 500)
        }

        return this.setState({ openModal })
    }

    onClickBards() {
        this.deleteFlow()
        this.createFlow()
        return this.setState({ openBards: true, openEllipsis: false })
    }

    onClickEllipsis() {
        this.deleteFlow()
        this.createFlow()
        return this.setState({ openEllipsis: true, openBards: false })
    }

    deleteFlow() {
        const els = document.querySelectorAll('#headerBackground')
        if(!els.length) return

        els.forEach((e) => e.remove())
    }

    createFlow() {
        const el = document.getElementById('root')
        if(!el) return

        const bg = document.createElement('div')

        bg.style.position = 'fixed'
        bg.style.left = '0'
        bg.style.top = '0'
        bg.style.height = '100vh'
        bg.style.width = '100vw'
        bg.style.backgroundColor = 'rgba(1, 1, 1, 0.4)'
        bg.id = 'headerBackground'
        bg.style.zIndex = '0'
        bg.onclick = () => { this.deleteFlow(); this.setState({ openEllipsis: false, openBards: false }) }

        return el.appendChild(bg)
    }

    onScrollWindow() {
        const el = this.state?.ref?.current
        if(el) {
            if(window.scrollY > 1) {
                return this.setState({ isScroll: true })
            }
        }

        return this.setState({ isScroll: false })
    }

    getLocales() {
        return this.state.locales.map((l) => ({ label: this.props.t(`language.${l}`), value: l }))
    }

    state = {
        ref: createRef(), isScroll: false, openBards: false, openEllipsis: false,
        openModal: false, locales: [ 'ru', 'en' ], links: [
            {
                label: 'pages.main.header.documentation',
                href: links.documentation, icon: BookOpen,
                target: '_mblank'
            },
            {
                label: 'pages.main.header.commands',
                href: links.commands, icon: TerminalLine
            },
            {
                label: 'pages.main.header.statistics',
                href: links.stats, icon: ChartAreaStackedNormalized
            },
            {
                label: 'pages.main.header.support',
                href: links.donate, icon: Heart
            },
            {
                label: 'pages.main.header.help',
                href: links.support,
                target: '_mblank'
            }
        ]
    }
}

export default withTranslation()(Header)