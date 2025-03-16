import { Component } from "react";
import { IThemeOptions } from "../../types/theme";

import { ReactComponent as IconThemeNight } from '../../assets/svg/ThemeNight.svg';
import { ReactComponent as IconThemeLight } from '../../assets/svg/ThemeLight.svg';
import { IconButton } from "../IconButton/IconButton";

export class ThemeSwither extends Component<IThemeOptions, IThemeOptions> {
    state = { theme: this.props.theme }

    render() {
        return <IconButton
        onClick={this.changeTheme.bind(this)}
        icon={
            this.state.theme === 'dark' ? IconThemeLight : IconThemeNight
        }
        />
    }

    changeTheme() {
        const theme = this.state.theme === 'dark' ? 'light' : 'dark'

        const item = localStorage.getItem('niako')
        if(item) {
            const json = JSON.parse(item)
            json.darkTheme = theme === 'dark'
            localStorage.setItem('niako', JSON.stringify(json))
        }

        this.setState({ theme })
        document.documentElement.dataset.theme = theme
    }
}