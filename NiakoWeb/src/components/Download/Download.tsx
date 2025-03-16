import { CircularProgress } from "@mui/material";
import { Component } from "react";
import styles from './Download.module.scss'

import { ReactComponent as IconFolder } from '../../assets/svg/Folder.svg';

export class Download extends Component<{ id: string, loading?: boolean, accept: string, onChange: (e: any) => any }> {
    render() {
        return (
            <label className={styles.download}>
                { this.props?.loading ? <CircularProgress size={24} className={styles.loader} /> : <IconFolder className={styles.icon}/> }
                <p className={styles.text}>Загрузить</p>
                <input className={styles.input} type='file' name={this.props.id} id={this.props.id} accept={this.props.accept} onChange={this.props.onChange}/>
            </label>
        )
    }
}