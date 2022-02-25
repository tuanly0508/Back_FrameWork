import { Request, Response } from "express";
import { wishListService } from "../services/WishListService";

class WishListController {

    get = async (req: Request, res:Response) => {
        const {idUser} = req.body
        const data = await wishListService.get(idUser)
        return res.json(data)
    }

    create = async (req: Request, res:Response) => {
        const {wishList} = req.body
        await wishListService.create(wishList)
        const data = await wishListService.get(wishList.id_user)
        return res.json(data)
    }

    update = async (req: Request, res:Response) => {
        const {wishList} = req.body
        const data = await wishListService.create(wishList)
        return res.json(data)
    }

    delete = async (req: Request, res:Response) => {
        const {wishList} = req.body
        await wishListService.delete(wishList)
        const data = await wishListService.get(wishList.id_user)
        return res.json(data)
    }
    
}
export const wishListController = new WishListController()