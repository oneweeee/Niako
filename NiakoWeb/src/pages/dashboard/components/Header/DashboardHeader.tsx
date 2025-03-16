import { Component } from "react";
import styles from './DashboardHeader.module.scss'

import { ReactComponent as IconHamburgerMenuOpen } from '../../../../assets/svg/HamburgerMenu.svg';
import { IconButton } from "../../../../components/IconButton/IconButton";
import { IDashboardDrawerMenuOptions } from "../../../../types/dashboard";
//import { Lightrope } from "../../../../components/Lightrope/Lightrope";
import { IconDropdown } from "../../../../components/IconDropdown/IconDropdown";

export class DashboardHeader extends Component<IDashboardDrawerMenuOptions, { user: any }> {
    render() {
        return(
            <div className={styles.header}>
                { /* <Lightrope /> */ }
                { <IconButton onClick={this.props.setOpenMenu} icon={this.props.state ? IconHamburgerMenuOpen : IconHamburgerMenuOpen } /> }
                <p className={styles.title}>{this.props.page}</p>
                <IconDropdown />
            </div>
        )
    }

    componentDidUpdate(prevProps: Readonly<IDashboardDrawerMenuOptions>) {
        if(prevProps.state !== this.props.state) {
            const app = document.getElementById('dashboardPlugin')
            if(!app) return

            if(!prevProps.state) {
                const blur = document.createElement('div')
                blur.id = 'headerBlur'
                blur.innerHTML = ''
                blur.style.position = 'fixed'
                blur.style.overflow = '0px'
                blur.style.top = '0px'
                blur.style.left = '0px'
                blur.style.width = '100vw'
                blur.style.height = '100vh'
                blur.style.background = 'rgba(0, 0, 0, 0.4)'
                blur.style.backdropFilter = 'blur(4px)'
                blur.style.transition = 'var(--animation-time)'
                blur.onclick = () => {
                    return this.props.setOpenMenu(false)
                }
                document.body.insertBefore(blur, null)
            } else {
                const blur = document.querySelectorAll('#headerBlur')
                if(!blur?.length) return

                blur.forEach((b) => {
                    document.body.removeChild(b)
                })
            }
        }
    }
}