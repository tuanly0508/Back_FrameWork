import { Request, Response } from "express";
import { weightService } from "../services/WeightService";

class WeightController {
    //get
    list = async (req: Request, res:Response) => {
        const idProductLine = req.params.idProductLine
        const data = await weightService.list(idProductLine)
        return res.json(data)
    }

    get = async (req: Request, res:Response) => {
        const data = await weightService.get()
        return res.json(data)
    }
    
}
export const weightController = new WeightController()