import { Request, Response } from "express";
import { categoryService } from "../services/CategoryService";

class CategoryController {
    //get cart
    get = async (req: Request, res:Response) => {
        const data = await categoryService.get()
        return res.json(data)
    }
    
}
export const categoryController = new CategoryController()