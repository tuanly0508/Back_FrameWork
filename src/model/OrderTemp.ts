
import { OrderProduct } from "./OrderProduct";
import { User } from "./User";

export interface OrderTemp {
    idOrder: string;
    idUser: string
    createAt: string
    isTemp: Boolean
    name?: string
    email?:string
    phone?:string
    address?: string
    status?:string
}

export interface OrderWithDetail extends OrderTemp {
    orderProduct: OrderProduct[]
}

export interface OrderWithUser extends OrderWithDetail {
    user: User
} 
