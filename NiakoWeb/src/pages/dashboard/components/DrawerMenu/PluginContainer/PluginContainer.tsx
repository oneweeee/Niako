import { Component, startTransition } from "react";
import styles from './PluginContainer.module.scss'
import { IDashboardPlugin } from "../../../../../types/dashboard";

import { ReactComponent as IconArrowDown } from '../../../../../assets/svg/ArrowDown.svg';

export class PluginContainer extends Component<{ key: number, plugin: IDashboardPlugin, currecyPage: string, setPage?: (page: string) => any, setPlugin: (plugin: any) => any }, { style?: any, opened: boolean }> {
    state = { style: undefined, opened: true }
    
    render() {
        let checked = this.props.plugin.name === this.props.currecyPage && (!this.props.plugin.childrens || this.props.plugin.childrens.length === 0)
        
        return (
            <div key={this.props.plugin.name} className={styles.plugin_title__container + (checked ? ' ' + styles.plugin_title__container_checked : '')}>
                <div className={styles.plugin_title} onClick={this.onClickPage.bind(this)}>
                    <div className={styles.plugin_title__title}>
                        {
                            (this.props.plugin.strokeIcon && this.props.plugin.fillIcon) ? checked ? <this.props.plugin.fillIcon className={styles.icon}/> : <this.props.plugin.strokeIcon className={styles.icon}/> : ''
                        }
                        <span className={`${styles.plugin_title__text} ${this.props.plugin.childrens && this.props.plugin.childrens.length > 0 ? styles.plugin_title__category : ''}`}>
                            {this.props.plugin.title}
                        </span>
                    </div>

                    <div className={styles.plugin_title__right}>
                        {
                            this.props.plugin.childrens && this.props.plugin.childrens.length > 0 && (
                                <IconArrowDown className={`${styles.icon} ${this.state?.style || ''}`}/>
                            )
                        }
                    </div>
                </div>
                <div className={styles.plugin_title__childs + ' ' + (this.state.opened ? 'plugin_title__childs_opened' + this.props.plugin.name : 'plugin_title__childs_closed' + this.props.plugin.name)}>
                    <div className={styles.plugin_title__childs_line_container}>
                        <div className={styles.plugin_title__childs_line}></div>
                    </div>
                    <div className={styles.plugin_title__childs_items}>
                        {
                            this.props.plugin.childrens && this.props.plugin.childrens.length > 0 &&
                            this.props.plugin.childrens.map((child, i) => {
                                return <PluginContainer key={i} plugin={child} setPlugin={this.props.setPlugin} currecyPage={this.props.currecyPage} setPage={this.props.setPage} />
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }

    componentDidMount() {
        class StyleSheet {
            styleSheet: any

            constructor(name = 'dynamic-styleSheet') {
              this.styleSheet = this.getStyleSheet(name)
            }
          
            getStyleSheet(name: string) {
              if (!document.getElementById(name)) {
                const style = document.createElement('style')
                style.title = name
                document.getElementsByTagName('head')[0].appendChild(style)
              }
          
              let styleSheet = null
              for (let i = 0; i < document.styleSheets.length; i++) {
                styleSheet = document.styleSheets[i]
                if (styleSheet.title === name) {
                  break
                }
              }
              return styleSheet
            }
            insertRule(css: any, index: any) {
              return this.styleSheet.insertRule(css, index)
            }
            deleteRule(index: any) {
              this.styleSheet.deleteRule(index)
            }
          }

        const script = document.createElement("script");
        script.async = true;
    
        document.body.appendChild(script);

        if(this.props.plugin.childrens && this.props.plugin.childrens.length > 0)  {
            let styleSheet = new StyleSheet();
            styleSheet.insertRule(`
            .plugin_title__childs_opened${this.props.plugin.name} {
                transform: scaleY(1);
                animation: opened${this.props.plugin.name} .2s ease-in-out;
            }
            `, 0);
            styleSheet.insertRule(`
            @keyframes opened${this.props.plugin.name} {
                0% {
                    height: 0px;
                    opacity: 0;
                }
                100% {
                    height: ${56 * this.props.plugin.childrens.length}px;
                    opacity: 1;
                }
            }
            `, 0);
            styleSheet.insertRule(`
            .plugin_title__childs_closed${this.props.plugin.name} {
                height: 0px;
                animation: closed${this.props.plugin.name} .2s  ease-in-out;
            }
            `, 0);

            styleSheet.insertRule(`
            @keyframes closed${this.props.plugin.name} {
                0% {
                    height: ${56 * this.props.plugin.childrens.length}px;
                    opacity: 1;
                }
                100% {
                    height: 0px;
                    opacity: 0;
                }
            }
            `, 0);
        }
    }

    onClickPage() {
        if(!this.props?.setPage) return

        if(!this.props.plugin.childrens || this.props.plugin.childrens.length === 0) {
            startTransition(() => {
                this.props.setPlugin(this.props.plugin)
                this.props.setPage!(this.props.plugin.name)
            })
        }
        
        const opened = this.props.plugin.childrens && this.props.plugin.childrens.length > 0  ? !this.state.opened : false
        
        return this.setState({ style: (opened ? styles.open_icon : styles.close_icon), opened })
    }
}