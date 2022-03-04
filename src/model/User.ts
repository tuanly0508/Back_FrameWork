export interface User{
    id_user: string
    name_user: string
    email: string
    phone: string
    address: string
    role:string
    id_order:string
    repass?:string
    pass?: string
    create_at?: string
    update_at?:string
}