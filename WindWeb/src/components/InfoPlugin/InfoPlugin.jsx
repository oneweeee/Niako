import { Component, createRef } from "react";
import { withTranslation } from "react-i18next";
import { Icon } from "@gravity-ui/uikit";
import styles from './InfoPlugin.module.scss';

class InfoPlugin extends Component {
    state = { inView: false, ref: createRef() }

    render() {
        return (
            <div ref={this.state.ref} className={`${styles.plugin} ${this.props?.toRight ? styles.reverse : ''} ${this.state.inView ? styles.pluginShow : ''}`}>
                <video className={styles.video} autoPlay={true} loop={true} muted={true} playsInline={true} poster={this.props.plugin.poster}>
                    <source src={this.props.plugin.video} type='video/mp4'></source>
                </video>
                <div className={styles.info}>
                    <div className={styles.title}>
                        { this.props.plugin?.icon && <Icon className={styles.icon} data={this.props.plugin.icon} size={24} /> }
                        <p className={styles.text}>{ this.props.t(this.props.plugin.title) }</p>
                    </div>
                    {
                        this.props.plugin?.description && (
                            <p className={styles.description}>
                                { this.props.t(this.props.plugin.description) }
                            </p>
                        )
                    }
                    {
                        this.props.plugin?.data?.length && (
                            <div className={styles.contents}>
                            {
                                this.props.plugin.data.map((res) => (
                                    <div className={styles.container}>
                                        { res?.icon && <Icon className={styles.icon} data={res.icon} size={22} /> }
                                        <div className={styles.content}>
                                            <p className={styles.title}>{this.props.t(res.title)}</p>
                                            <p className={styles.description}>{this.props.t(res.description)}</p>
                                        </div>
                                    </div>
                                ))
                            }
                            </div>
                        )
                    }
                </div>
            </div>
        )
    }

    componentDidMount() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if(entry.isIntersecting) {
                    this.setState({ inView: true })
                }
            })
        })
      
        observer.observe(this.state.ref.current)
    }
}

export default withTranslation()(InfoPlugin)