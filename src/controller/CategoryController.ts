import { Request, Response } from "express";
import { categoryService } from "../services/CategoryService";

class CategoryController {

    get = async (req: Request, res:Response) => {
        const data = await categoryService.list()
        return res.json(data)
    }

    create = async (req: Request, res:Response) => {
        const {category} = req.body;
        await categoryService.create(category)
        const data = await categoryService.list()
        return res.json(data)
    }

    update = async (req: Request, res:Response) => {
        const {category} = req.body;
        await categoryService.update(category)
        const data = await categoryService.list()
        return res.json(data)
    }

    delete = async (req: Request, res:Response) => {
        const {id_category} = req.body;
        await categoryService.delete(id_category)
        const data = await categoryService.list()
        return res.json(data)
    }
    
}
export const categoryController = new CategoryController()