import { Component } from "react";
import { Card, Skeleton } from "@gravity-ui/uikit";
import { Person } from '@gravity-ui/icons';
import { razbitNumber } from "../../util";
import styles from './GuildCard.module.scss'

class GuildCard extends Component {
    render() {
        if(!this.props?.guild) {
            return <Skeleton style={{width: this.props.width > 563 ? '262px' : '100%', height: '90px'}} />
        }

        return (
            <Card className={styles.card} view='outlined'>
                <div className={styles.container}>
                    <img className={styles.icon} alt='Guild Icon' src={this.props.guild.icon.replace('png', 'webp').replace('4096', '128')}/>
                    <div className={styles.info}>
                        <p className={styles.name}>{this.props.guild.name}</p>
                        <div className={styles.members}>
                            <Person className={styles.icon} />
                            <p className={styles.text}>{razbitNumber(this.props.guild.memberCount)}</p>
                        </div>
                    </div>
                </div>
            </Card>
        )
    }
}

export default GuildCard