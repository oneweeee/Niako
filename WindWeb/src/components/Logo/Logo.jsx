import { Component } from "react";
//import { LogoLightTheme, LogoDarkTheme } from '../../assets/svg/index';

class Logo extends Component {
    render() {
        const size = this.props?.size || 56
        const style = { width: `${size}px`, height: `${size}px` }
        if(this.props.theme === 'dark-hc') {
            return <img src='https://niako.xyz/static/media/Logo-256.45247537d04eea8c9ab8.png' alt='Logo' style={{ ...style, borderRadius: '100%' }}/>
        } else {
            return <img src='https://niako.xyz/static/media/Logo-256.45247537d04eea8c9ab8.png' alt='Logo' style={{ ...style, borderRadius: '100%' }}/>
        }
    }
}

export default Logo