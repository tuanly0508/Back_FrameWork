import { Request, Response } from "express";
import { brandService } from "../services/BrandService";
import { cartService } from "../services/CartService";
import { orderService } from "../services/OrderService";

class BrandController {
    //get cart
    get = async (req: Request, res:Response) => {
        const data = await brandService.get()
        return res.json(data)
    }
    
}
export const brandController = new BrandController()