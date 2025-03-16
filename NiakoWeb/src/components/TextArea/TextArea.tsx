import { Component } from "react";
import styles from './TextArea.module.scss'

export class TextArea extends Component<{ onChange: (e: any) => any, id?: string, content?: string, maxLength?: number, minLength?: number }> {
    render() {
        return (
            <textarea id={this.props.id} onChange={this.props.onChange} className={styles.textarea} defaultValue={this.props.content} maxLength={this.props.maxLength} minLength={this.props.minLength}></textarea>
        )
    }
}