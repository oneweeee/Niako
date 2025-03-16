import { Component } from "react";
import { ITabIconOptions } from "../../types/tabs";
import styles from './TabsContainer.module.scss'

import { ReactComponent as IconArrowRight } from '../../assets/svg/ArrowRight.svg';
import { ReactComponent as IconArrowLeft } from '../../assets/svg/ArrowLeft.svg';

export class TabsContainer extends Component<{ className?: any, options: (ITabIconOptions)[], activeTab: string, onClick: (tab: string) => any }, { width: number, innerWidth: number, gap: number, step: number, tabs: any }> {
    
    constructor(props: any) {
        super(props)

        let tabs: { [k: string]: number } = {}
        for ( let i = 0; props.options.length > i; i++ ) {
            tabs[props.options[i].label] = i
        }

        this.state = {
            innerWidth: window.innerWidth,
            width: 310,
            gap: 8,
            step: 0,
            tabs
        }
    }

    resize(state: any) {
        const span = document.getElementById('tabspan')
        if(!span) return
        span.style.zIndex = '0'
        span.style.right = state.gap + (this.props.options.length - 1 - state.step) * (state.width + state.gap) + 'px'
    }

    componentDidMount() {
        const span = document.getElementById('tabspan')
        if(!span) return

        const firstTab = Object.keys(this.state.tabs)[0]

        span.style.right = 0 + 'px'

        let resize = Math.floor(span.parentElement!.offsetWidth / (this.props.options.length)) - 10
        this.setState({ width: resize })
        setTimeout(() => { this.resize(this.state) }, 10)

        window.addEventListener('resize', () => {
            const span = document.getElementById('tabspan')
            if(!span) return

            if(this.props.activeTab === 'None' && window.innerWidth >= 740) {
                this.setState({
                    step: this.state.tabs[firstTab],
                    innerWidth: window.innerWidth
                })

                this.props.onClick(firstTab)

                const settings = document.getElementById('settings')
                if(settings) {
                    settings.style.display = 'flex'
                }
            }
            
            let resize = Math.floor(span.parentElement!.offsetWidth / (this.props.options.length)) - 10
            this.setState({ width: resize, innerWidth: window.innerWidth })
                setTimeout(() => { this.resize(this.state) }, 10)
        })

        this.resize(this.state)
    }

    render() {
        if(740 >= this.state.innerWidth) {
            const find = this.props.options.find((t) => t.label === this.props.activeTab)
            if(find) {
                return (
                    <div className={`${styles.openTab} ${this.props?.className || ''}`} onClick={
                        () => {
                            this.props.onClick('None')
                            const settings = document.getElementById('settings')
                            if(settings) {
                                settings.style.display = 'none'
                            }
                        }
                    } key={find.label}>
                        <div className={styles.content}>
                            <IconArrowLeft className={styles.icon} />
                            <p className={styles.text}>{find.label}</p>
                        </div>
                    </div>
                )
            }
        }

        return (
            <div id='tab' className={styles.tabs}>
                <span id="tabspan" className={styles.span} style={{ 'width': this.state.width }}></span>
                { this.props.options.map((tab) => {
                    return (
                        <div key={tab.label} className={`${styles.tab} ${this.props.activeTab === tab.label ? styles.activeTab : ''}`} onClick={() => {

                            this.setState({
                                step: this.state.tabs[tab.label]
                            })
                            setTimeout(() => {
                                this.resize(this.state)
                            }, 10)
                            
                            this.props.onClick(tab.label)
                            if(740 >= window.innerWidth) {
                                const settings = document.getElementById('settings')
                                if(settings) {
                                    settings.style.display = 'flex'
                                }
                            }
                        }} >
                            <div className={styles.content}>
                                {
                                tab?.strokeIcon && tab?.fillIcon ? tab.label === this.props.activeTab ? <tab.fillIcon className={styles.icon} /> : <tab.strokeIcon className={styles.icon} /> : ''
                                }
                                <p className={styles.text}>{tab.label}</p>
                            </div>
                            {
                                window.innerWidth > 740 ? '' : (
                                    !this.props.options.map((t) => t.label).includes(this.props.activeTab) ? <IconArrowRight className={styles.icon} /> : ''
                                )
                            }
                        </div>
                    )
                }
                )}
            </div>
        )
    }
}
