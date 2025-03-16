import { Component, lazy, startTransition } from 'react';
import { IDashboardPluginOptions, IDrawerMenuOptions } from '../../../../types/dashboard';
import { PluginContainer } from './PluginContainer/PluginContainer';
import { AddServerButton } from './AddServerButton/AddServerButton';
import styles from './DrawerMenu.module.scss'

//import { IconButton } from '../../../../components/IconButton/IconButton';
import Avatar from '../../../../assets/img/DefaultAvatar.png';
import Logo from '../../../../assets/img/Logo-96.png';

//import { ReactComponent as IconArrowLeft } from '../../../../assets/svg/ArrowDoubleLeft.svg';
//import { ReactComponent as IconWidgetStroke } from '../../../../assets/svg/WidgetStroke.svg';
//import { ReactComponent as IconWidgetFill } from '../../../../assets/svg/WidgetFill.svg';
import { ReactComponent as IconSettingsStroke } from '../../../../assets/svg/SettingsStroke.svg';
import { ReactComponent as IconSettingsFill } from '../../../../assets/svg/SettingsFill.svg';
import { ReactComponent as IconCompassStroke } from '../../../../assets/svg/CompassStroke.svg';
import { ReactComponent as IconGalleryStroke } from '../../../../assets/svg/GalleryStroke.svg';
import { ReactComponent as IconGalleryFill } from '../../../../assets/svg/GalleryFill.svg';
import { ReactComponent as IconRoomStroke } from '../../../../assets/svg/RoomStroke.svg';
import { ReactComponent as IconRoomFill } from '../../../../assets/svg/RoomFill.svg';
import { ReactComponent as IconHandStroke } from '../../../../assets/svg/HandStroke.svg';
import { ReactComponent as IconHandFill } from '../../../../assets/svg/HandFill.svg';
import { ReactComponent as IconHourglassStroke } from '../../../../assets/svg/HourglassStroke.svg';
import { ReactComponent as IconHourglassFill } from '../../../../assets/svg/HourglassFill.svg';
import { ReactComponent as IconConfettiStroke } from '../../../../assets/svg/ConfettiStroke.svg';
import { ReactComponent as IconConfettiFill } from '../../../../assets/svg/ConfettiFill.svg';
//import { ReactComponent as IconSmileStroke } from '../../../../assets/svg/SmileStroke.svg';
//import { ReactComponent as IconSmileFill } from '../../../../assets/svg/SmileFill.svg';
import { ReactComponent as IconCupStroke } from '../../../../assets/svg/CupStroke.svg';
import { ReactComponent as IconCupFill } from '../../../../assets/svg/CupFill.svg';
import { ReactComponent as IconMusicStroke } from '../../../../assets/svg/MusicStroke.svg';
import { ReactComponent as IconMusicFill } from '../../../../assets/svg/MusicFill.svg';
import { ReactComponent as IconSettingsMiniStroke } from '../../../../assets/svg/SettingsMiniStroke.svg';
import { ReactComponent as IconSettingsMiniFill } from '../../../../assets/svg/SettingsMiniFill.svg';
import { ReactComponent as IconCodeStroke } from '../../../../assets/svg/CodeStroke.svg';
import { ReactComponent as IconCodeFill } from '../../../../assets/svg/CodeFill.svg';
import { ReactComponent as IconChatStroke } from '../../../../assets/svg/ChatStroke.svg';
import { ReactComponent as IconChatFill } from '../../../../assets/svg/ChatFill.svg';

export class DrawerMenu extends Component<IDashboardPluginOptions, IDrawerMenuOptions> {
    state = {
        currecyPage: 'Setting',
        plugins: [
            /*{
                name: 'Plugin',
                title: 'Плагины',
                strokeIcon: IconWidgetStroke,
                fillIcon: IconWidgetFill,
                //component: lazy(() => import('../../plugins/Plugin/Plugin'))
            },*/
            {
                name: 'Setting',
                title: 'Настройка',
                strokeIcon: IconSettingsStroke,
                fillIcon: IconSettingsFill
            },
            {
                name: 'Server',
                title: 'Серверные',
                strokeIcon: IconCompassStroke,
                fillIcon: IconCompassStroke,
                childrens: [
                    {
                        name: 'Banner',
                        title: 'Баннер',
                        strokeIcon: IconGalleryStroke,
                        fillIcon: IconGalleryFill,
                        component: lazy(() => import('../../plugins/Banner/Banner'))
                    },
                    {
                        name: 'Room',
                        title: 'Комнаты',
                        strokeIcon: IconRoomStroke,
                        fillIcon: IconRoomFill,
                        component: lazy(() => import('../../plugins/Room/Room'))
                    },
                    {
                        name: 'WelcomeAndGoodbye',
                        title: 'Приветствия & Прощания',
                        strokeIcon: IconHandStroke,
                        fillIcon: IconHandFill
                    },
                    {
                        name: 'Audit',
                        title: 'Аудит',
                        strokeIcon: IconHourglassStroke,
                        fillIcon: IconHourglassFill,
                        component: lazy(() => import('../../plugins/Audit/Audit'))
                    }
                ]
            },
            {
                name: 'Entertainment',
                title: 'Развлечения',
                strokeIcon: IconConfettiStroke,
                fillIcon: IconConfettiFill,
                childrens: [
                    /*{
                        name: 'Reaction',
                        title: 'Реакции',
                        strokeIcon: IconSmileStroke,
                        fillIcon: IconSmileFill
                    },*/
                    {
                        name: 'Level',
                        title: 'Уровни',
                        strokeIcon: IconCupStroke,
                        fillIcon: IconCupFill
                    },
                    {
                        name: 'Music',
                        title: 'Музыка',
                        strokeIcon: IconMusicStroke,
                        fillIcon: IconMusicFill
                    }
                ]
            },
            {
                name: 'Util',
                title: 'Утилиты',
                strokeIcon: IconSettingsMiniStroke,
                fillIcon: IconSettingsMiniFill,
                childrens: [
                    {
                        name: 'Command',
                        title: 'Личные команды',
                        strokeIcon: IconCodeStroke,
                        fillIcon: IconCodeFill
                    },
                    {
                        name: 'EmbedGenerator',
                        title: 'Эмбед генератор',
                        strokeIcon: IconChatStroke,
                        fillIcon: IconChatFill,
                        component: lazy(() => import('../../plugins/EmbedBuilder/EmbedBuilder'))
                    }
                ]
            }
        ]
    }

    render() {        
        return (
            <div id='drawermenu' className={`${styles.sidebar} ${typeof this.props.openMenu === 'boolean' ? (this.props.openMenu ? styles.open : styles.hide) : ''}`}>
                <div className={styles.header_profile}>
                    <img className={styles.logo} src={Logo} alt='Niako' />
                    <div className={styles.profile}>
                        <div className={styles.avatar_container}>
                            <img className={styles.avatar} src={this.props.user.avatar.replace('4096', '128')} alt='Avatar' />
                        </div>
                        <p className={styles.username}>{this.props.user.username}</p>
                    </div>
                    { /* <IconButton onClick={this.props.setOpenMenu} icon={IconArrowLeft} useBig={true} /> */ }
                </div>
                <div className={styles.menu}>
                    <div className={styles.guilds}>
                        {
                            this.props.guilds.map((g) => {
                                const icon = g.icon ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.${(g.icon as string).startsWith('a_') && g.id === this.props.currecyGuildId ?  'gif' : 'png'}?size=96` : Avatar
                                return (
                                    <div key={g.id} className={styles.guild}>
                                        {g.id === this.props.currecyGuildId ? <div className={styles.decor}></div> : <span className={styles.nodecor}></span>}
                                        <img className={g.id === this.props.currecyGuildId ? styles.active : styles.icon} src={icon} alt='Icon'
                                        onClick={this.props?.guildState && g.id !== this.props.currecyGuildId ? () => {
                                            if(!this.props.guildState) return

                                            this.props.setGuildState(false)
                                            this.props.setCurrencyGuild(g.id)
                                            startTransition(() => {
                                                this.props.setPlugin(this.getPlugin(this.props.plugin.name))
                                            })
                                        } : undefined}
                                        />
                                        <div className={styles.tooltype}>
                                            <p className={styles.name}>{g.name}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <div className={styles.guild}>
                            <span className={styles.no}></span>
                            <AddServerButton />
                        </div>
                    </div>
                    <div className={styles.plugins}>
                        {
                            this.state.plugins.map((plugin, i) => {
                                return <PluginContainer setPlugin={this.props.setPlugin} key={i} plugin={plugin} currecyPage={this.state.currecyPage} setPage={this.props?.guildState ? this.setCurrencyPage.bind(this) : undefined} />
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        startTransition(() => {
            return this.props.setPlugin(this.getPlugin(this.state.currecyPage))
        })
    }

    getPlugin(name: string) {
        return this.getPlugins(this.state.plugins).find((p) => p.name === name)
    }

    getPlugins(array: any[]): any[] {
        let arr = []
        for ( let i = 0; array.length > i; i++ ) {
            if(!array[i].childrens) {
                arr.push(array[i])
            } else {
                arr.push(...this.getPlugins(array[i].childrens))
            }
        }

        return arr
    }

    setCurrencyPage(page: string) {
        this.props.setOpenMenu(false)
        return this.setState({ currecyPage: page })
    }
}