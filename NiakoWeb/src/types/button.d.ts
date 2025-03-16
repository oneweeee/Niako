export type TButtonType = 'Fill' | 'Stroke'

export type TButtonStyle = 'Primary' | 'Theme' | 'Red' | 'None'

export interface IButtonOptions {
    type: TButtonType,
    className?: any,
    content?: string,
    icon?: any,
    color?: TButtonStyle,
    onClick?: Function,
    alignSelf?: 'stretch',
    href?: string,
    loading?: boolean
}