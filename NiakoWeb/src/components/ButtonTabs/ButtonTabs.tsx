import { Component, CSSProperties } from "react";
import { Skeletone } from "../Skeletone/Skeletone";
import styles from './ButtonTabs.module.scss'

export class ButtonTabs extends Component<{ categorys: { label: string, value: string }[], active?: string, isLoading?: boolean, onClick: any }, { bgStart: CSSProperties, bgEnd: CSSProperties }> {
    state = {
        bgStart: { display: 'none' },
        bgEnd: {}
    }

    render() {
        return (
            <div className={styles.container} onScroll={this.onScroll.bind(this)}>
                <div className={styles.start} style={this.state.bgStart}></div>
                {
                    this.props.categorys.map((b) => this.getButton(b, this.props?.isLoading))
                }
                <div className={styles.end} style={this.state.bgEnd}></div>
            </div>
        )
    }

    getButton(res: { label: string, value: string }, isLoading?: boolean) {
        if(isLoading) {
            return <Skeletone key={res.value} className={styles.button} type='button' style={{ width: `${res.label.length * 7}px`, cursor: 'default', border: 0 }} />
        }

        return (
            <div key={res.value} className={`${styles.button} ${this.props.active === res.value ? styles.active : ''}`} onClick={this.props.onClick.bind(this, res.value)}>
                <p className={styles.text}>{res.label}</p>
            </div>
        )
    }

    scrolled: number = 40

    onScroll(e: any) {
        if(window.innerWidth > 960) return

        const left = e.target.scrollLeft
        const width = e.target.offsetWidth
        const scrollW = e.target.scrollWidth

        if(left > 0) {
            this.setState({
                bgStart: { display: 'flex', opacity: left > this.scrolled ? 1 : left/this.scrolled }
            })
        } else {
            this.setState({
                bgStart: { display: 'none', opacity: 0 }
            })
        }

        if(scrollW > (width+left)) {
            this.setState({
                bgEnd: { display: 'flex', opacity: scrollW-(width+left) > this.scrolled ? 1 : (scrollW-(width+left))/this.scrolled }
            })
        } else {
            this.setState({
                bgEnd: { display: 'none', opacity: 0 }
            })
        }
    }
}