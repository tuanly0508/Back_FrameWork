import { Image } from "./Image";
import { Product } from "./Product";

export interface ProductLine {
    idProductLine: string,
    idBrand: string,
    idCategory: string,
    nameProduct: string
    sellCount: number
    createAt: string
    updateAt: string
    image?: Image
}