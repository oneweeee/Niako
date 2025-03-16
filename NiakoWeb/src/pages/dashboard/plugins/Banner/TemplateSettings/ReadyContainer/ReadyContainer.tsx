import { LazyLoadImage } from "react-lazy-load-image-component";
import { Component } from "react";
import { apiUrl } from "../../../../../../config";
import styles from './ReadyContainer.module.scss'
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Button } from "../../../../../../components/Button/Button";

import { ReactComponent as IconAddCircle } from '../../../../../../assets/svg/AddCircleStroke.svg'
import { ReactComponent as IconBoost } from '../../../../../../assets/svg/Boost.svg'

export class ReadyContainer extends Component<{ setReadyItems: (config: any, color: string) => Promise<any>, currecyGuildId: string, boostCount: number, config: { name: string, originColor: string, colors: string[], fileName: string, premium: boolean, items: any[] } }, { style: any, loading: boolean, currencyColor: string }> {
    render() {
        if(!this.state?.currencyColor) {
            return (<div></div>)
        }

        return (
            <div className={styles.card}>
                <div className={styles.preview}>
                    <LazyLoadImage src={`${apiUrl}/banner/${this.props.config.fileName}_${this.state.currencyColor}.png`}
                    className={styles.image} alt={this.props.config.fileName} effect="blur"
                    placeholderSrc={`${apiUrl}/banner/${this.props.config.fileName}_${this.state.currencyColor}.png`}
                    />
                </div>
                <div className={styles.info}>
                    <p className={styles.name}>{this.props.config.name}</p>
                    <div className={styles.colors}>
                        {
                            this.props.config.colors.map((c) => {
                                return (<div
                                key={c} onClick={this.clickColor.bind(this, c)} style={c === 'Original' ? { background: this.props.config.originColor } : undefined }
                                className={`${styles.color} ${this.switchColorStyle(c)}`}
                                ></div>)
                            })
                        }
                    </div>
                    {
                        2 > this.props.boostCount && this.props.config.premium ? (
                            <a className={`${styles.button} ${styles.premiumButton}`} href='https://docs.niako.xyz/premium/faq'>
                                <IconBoost className={styles.icon}/>
                                <p className={styles.text}>Доступно только с премиум</p>
                            </a>
                        ) : (
                            <Button type='Fill' color='Theme' content='Применить' loading={this.state.loading} icon={IconAddCircle} onClick={async () => {
                                this.setState({ style: styles.agreeButton, loading: true });
                                await this.props.setReadyItems(this.props.config, this.state.currencyColor).then(() => {
                                    this.setState({ style: undefined, loading: false });
                                })
                            }} alignSelf='stretch' />
                        )
                    }
                </div>
            </div>
        )
    }

    async componentDidMount() {
        return this.setState({currencyColor: this.randomElement(this.props.config.colors) })
    }

    clickColor(color: string) {
        return this.setState({ currencyColor: color })
    } 

    switchColorStyle(color: string) {
        switch(color) {
            case 'Pink':
                return styles.pink
            case 'Blue':
                return styles.blue
            case 'Red':
                return styles.red
            case 'Purple':
                return styles.purple
            case 'Green':
                return styles.green
            case 'Yellow':
                return styles.yellow
            case 'White':
                return styles.white
            default:
                return ''
        }
    }
    
    private random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    private randomElement<T>(array: T[]) {
        return array[this.random(0, array.length-1)]
    }
}