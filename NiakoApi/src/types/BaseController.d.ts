export interface IRequestCreateOptions {
    message?: string,
    answer?: any
}

export interface IRequestAnswer {
    status: boolean,
    code: number,
    message?: string,
    answer?: any
}