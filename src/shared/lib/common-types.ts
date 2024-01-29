export type BaseResponse<T = {}> = {
    data: T
    resultCode: number
    messages: string[]
    fieldsErrors: FieldsErrors[]
}

export type FieldsErrors = {
    errors: string
    field: string
}
