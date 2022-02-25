import { Product } from "./Product";

export interface OrderProduct{
    idOrder: string
    idProduct: string
    quantity: number
    product?: Product
}