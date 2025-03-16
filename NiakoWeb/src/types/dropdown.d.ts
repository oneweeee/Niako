export interface IDropdownOption { label: string, value: string, icon?: any, default?: boolean }

export interface ITextDropdownProps {
    placeholder?: string,
    placement?: 'top' | 'bottom',
    input?: boolean,
    opened?: boolean,
    disabled?: boolean,
    defaultValue?: string,
    options: IDropdownOption[],
    onClick: (v: string) => any
}

export interface IRoleDropdownProps {
    placeholder?: string,
    sendError?: (msg: string) => any,
    input?: boolean,
    maxCount?: number,
    defaultValues?: string[],
    img?: string,
    options: IDropdownOption[],
    onClick: (values: string[]) => any
}