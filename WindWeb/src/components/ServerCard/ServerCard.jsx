import { Component, createRef } from "react";
import { StarFill, Star, Gear, CirclePlus } from '@gravity-ui/icons';
import { Button, Icon, Skeleton } from "@gravity-ui/uikit";
import { getGuildIcon } from "../../util";
import { Link } from "react-router-dom";
import { links } from "../../config";
import styles from "./ServerCard.module.scss";

class ServerCard extends Component {
    state = { inView: false, ref: createRef() }

    render() {
        if(!this.props.data) {
            return <Skeleton className={styles.skeletone} />
        }

        return (
            <div ref={this.state.ref} className={`${styles.card} ${this.state.inView ? styles.pluginShow : ''}`}>
                <div className={styles.banner}>
                    <img src={getGuildIcon(this.props.data)} alt='Banner'></img>
                </div>
                <div className={styles.content}>
                    <div className={styles.profile}>
                        <div className={styles.title}>
                            <img src={getGuildIcon(this.props.data)} alt='Icon'></img>
                            <p className={styles.name}>{this.props.data.name}</p>
                        </div>
                        <Button view='flat' size='l' onClick={this.props.setFavoriteState.bind(this, this.props.data)}>
                            <Icon className={this.props.data.isFavorite ? styles.star : ''} data={this.props.data.isFavorite ? StarFill : Star} size={16}/>
                        </Button>
                    </div>
                    {
                        this.props.data.has ? (
                            <Link style={{ width: '100%' }} to={`/servers/${this.props.data.id}`}>
                                <Button width='max' view='normal' size='l'>
                                    <div className={styles.button_content}>
                                        <Icon data={Gear} size={16}/>
                                        <p className={styles.text}>Настроить</p>
                                    </div>
                                </Button>
                            </Link>
                        ) : (
                            <Link style={{ width: '100%' }} to={`${links.botInvite}&guild_id=${this.props.data.id}`}>
                                <Button width='max' view='normal' size='l'>
                                    <div className={styles.button_content}>
                                        <Icon data={CirclePlus} size={16}/>
                                        <p className={styles.text}>Пригласить</p>
                                    </div>
                                </Button>
                            </Link>
                        )
                    }
                </div>
            </div>
        )
    }

    componentDidMount() {
        if(!this.props.data) return
        
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

export default ServerCard