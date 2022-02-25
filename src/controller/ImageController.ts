import { Request, Response } from "express";
import { imageService } from "../services/ImageService";
import { productService } from "../services/ProductService";

class ImageController {

    createImage = async (req:Request, res: Response) => {
        const {idProductLine,image} = req.body
        await imageService.createImage(idProductLine,image)
        let data = await productService.getByIdProductLine(idProductLine)
        return res.json(data)
    }

    deleteImage = async (req:Request, res: Response) => {
        const {image,idProductLine} = req.body
        await imageService.deleteImage(image,idProductLine)
        let data = await productService.getByIdProductLine(idProductLine)
        return res.json(data) 
    }
}
export const imageController = new ImageController()