import { ProductLine } from "./ProductLine";
import { Weight } from "./Weight";

export interface Product{
   idProduct: string
   idProductLine: string
   weight: Weight 
   price: number
   name_age:string
   productLine?: ProductLine
}
