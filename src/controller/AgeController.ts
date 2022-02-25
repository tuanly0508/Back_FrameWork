import { Request, Response } from "express";
import { ageService } from "../services/AgeService";

class AgeController {
    //get cart
    get = async (req: Request, res:Response) => {
        const data = await ageService.get()
        return res.json(data)
    }
    
}
export const ageController = new AgeController()