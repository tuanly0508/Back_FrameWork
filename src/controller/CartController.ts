import { Request, Response } from "express";
import { cartService } from "../services/CartService";
import { orderService } from "../services/OrderService";

class CartController {
    //get cart
    get = async (req: Request, res:Response) => {
        const dataCart = await cartService.get(req.body.data.idUser)
        let totalPrice = this.price(dataCart)
        let listCart = {dataCart,totalPrice}
        return res.json(listCart)
    }
    
    //add cart
    create = async (req:Request, res: Response) => { 
        const {cart} = req.body
        let id = await orderService.checkEmpty(cart.idUser)
        await cartService.create(id,cart)
        const dataCart = await cartService.get(req.body.cart.idUser)
        let totalPrice = this.price(dataCart)
        let listCart = {dataCart,totalPrice}
        return res.json(listCart)
    }

    //delete cart
    delete = async (req:Request, res: Response) => {
        const {cart} = req.body
        await cartService.delete(cart)
        const dataCart = await cartService.get(cart.idUser)
        let totalPrice = this.price(dataCart)
        let listCart = {dataCart,totalPrice}
        return res.json(listCart)
    }

    //update cart
    update = async (req:Request, res: Response) => {
        const {cart} = req.body
        await cartService.update(cart)
        const dataCart = await cartService.get(cart.idUser)
        let totalPrice = this.price(dataCart)
        let listCart = {dataCart,totalPrice}
        return res.json(listCart)
    }

    //total price
    price = (dataCart: any[]) => {
        let totalPrice = 0
        dataCart.map((item) => {
            totalPrice += item.price * item.quantity
        })
        return totalPrice
    }
}
export const cartController = new CartController()