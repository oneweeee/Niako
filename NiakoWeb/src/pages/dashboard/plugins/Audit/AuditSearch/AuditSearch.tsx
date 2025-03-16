import { Component } from "react";
import { ButtonTabs } from "../../../../../components/ButtonTabs/ButtonTabs";
import { Skeletone } from "../../../../../components/Skeletone/Skeletone";
import { Input } from "../../../../../components/Input/Input";
import styles from './AuditSearch.module.scss'

import { ReactComponent as IconSearch } from '../../../../../assets/svg/Search.svg'

export class AuditSearch extends Component<{ setFilters: (input: string, types: string) => any, isLoading?: boolean, activeFilter: string, input: string }, { activeTab: string, inputContent: string }> {
    state = { activeTab: this.props.activeFilter, inputContent: this.props.input }

    render() {
        if(this.props?.isLoading) {
            return (
                <div className={styles.wrapper}>
                    <Skeletone type='input' />
                    <ButtonTabs isLoading={this.props.isLoading} onClick={this.onSetFilter.bind(this)} active={this.state.activeTab} categorys={this.categorys} />
                </div>
            )
        }

        return (
            <div className={styles.wrapper}>
                <div className={styles.input}>
                    <IconSearch className={styles.icon} />
                    <Input iconStart={true} placeholder='Поиск' onChange={this.onInputFilter.bind(this)} />
                </div>
                <ButtonTabs onClick={this.onSetFilter.bind(this)} active={this.state.activeTab} categorys={this.categorys} />
            </div>
        )
    }

    onSetFilter(activeTab: string) {
        this.props.setFilters(this.state.inputContent, activeTab)
        return this.setState({ activeTab: activeTab })
    }

    onInputFilter(e: any) {
        const inputContent = e.target.value
        this.props.setFilters(inputContent, this.state.activeTab)
        return this.setState({ inputContent })
    }

    categorys = [
        {
            label: 'Все',
            value: 'All'
        },
        {
            label: 'Участники',
            value: 'Member'
        },
        {
            label: 'Каналы',
            value: 'Channel'
        },
        {
            label: 'Роли',
            value: 'Role'
        },
        {
            label: 'Стикеры & Эмодзи',
            value: 'StickerAndEmoji'
        },
        {
            label: 'Другое',
            value: 'Other'
        }
    ]
}