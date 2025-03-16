import { Component } from "react";
import styles from './Modal.module.scss'
import { IconButton } from "../IconButton/IconButton";

import { ReactComponent as IconArrowLeft } from '../../assets/svg/ArrowLeft.svg';

export class Modal extends Component<{ show: boolean, title: string, description: string, width?: number, childs: any, onClose: (a: any) => any }> {
    render() {
        if(!this.props.show) {
            return ('')
        }

        return (
            <div className={styles.modal_wrapper}>
                <div className={styles.modal} style={{ width: this.props.width }}>
                    <div className={styles.content}>
                        <div className={styles.title}>
                            <IconButton icon={IconArrowLeft} useMini={true} onClick={this.props.onClose}/>
                            <p className={styles.text}>{this.props.title}</p>
                        </div>
                        <div className={styles.description}>{this.props.description}</div>
                        { this.props.childs }
                    </div>
                </div>
            </div>
        )
    }

    componentDidUpdate(props: any) {
        if(this.props.show !== props.show) {
            const app = document.getElementById('app')
            if(!app) return

            if(!props.show) {
                const blur = document.createElement('div')
                blur.id = 'modalBlur'
                blur.innerHTML = ''
                blur.style.position = 'fixed'
                blur.style.top = '0px'
                blur.style.left = '0px'
                blur.style.width = '100vw'
                blur.style.height = '100vh'
                blur.style.zIndex = '5'
                blur.style.background = 'rgba(0, 0, 0, 0.4)'
                blur.style.backdropFilter = 'blur(4px)'
                blur.style.transition = 'var(--animation-time)'
                blur.onclick = () => this.props.onClose(true)
                document.body.insertBefore(blur, null)
                app.style.overflow = 'hidden'
                app.style.height = '100vh'
            } else {
                const blur = document.querySelectorAll('#modalBlur')
                if(!blur?.length) return

                app.style.overflow = 'unset'
                app.style.height = 'auto'

                blur.forEach((b) => {
                    document.body.removeChild(b)
                })
            }
        }
    }
}