import { NextFunction, Request, Response } from "express";
import { userService } from "../services/UserService";
import jwt from "jsonwebtoken";
const bcrypt = require('bcrypt');
const saltRounds = 10;
class UserController {

    register = async (req: Request, res: Response) => {
        const { user } = req.body
        const email = await userService.checkMail(user.email)
        if (email) {
            return res.json(email)
        } else {
            bcrypt.hash (user.pass, saltRounds, async(err:string, hash:string) => {
                await userService.register(user,hash)
                if (user.address) {
                    const data = await userService.list()
                    return res.json(data)
                }else{
                    return res.json(email)
                }
            });
        }
    }

    login = async (req: Request, res: Response) => {
        const { email, pass } = req.body
        const data = await userService.checkMail(email)
        const dataFail:[] = []
        if(data) {
            bcrypt.compare(pass, data.pass, async (err:string, result:boolean) => {
                const datas = await userService.login(email, data.pass)
                if (result) {
                    const idUser = datas.id_user
                    const accessToken = jwt.sign({ idUser }, process.env.ACCESS_TOKEN_SECRET || 'tokenTest', { expiresIn: '6000s' })
                    return res.json({ datas, accessToken })
                }else {
                    return res.json(dataFail)
                }
            });
        }
    }

    authToken = async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers['authorization'] || ''

        if (!token) return res.status(401).json()
        try {
            const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'tokenTest')
            req.body.data = data
            next()
        } catch (error) {
            return res.status(403).json()
        }
    }

    checkAdmin = async (req: Request, res: Response, next: NextFunction) => {
        userService.getMe(req.body.data.idUser).then(resp => {
            if (resp[0].role === 'admin') {
                next()
            } else return res.status(403).json()
        })
    }

    update = async (req: Request, res: Response) => {
        const { user } = req.body
        await userService.update(user)
        const data = await userService.list()
        return res.json(data)
    }

    getById = async (req: Request, res: Response) => {
        const id = req.params.idUser
        const data = await userService.getMe(id)
        res.status(200).json(data)
    }

    getMe = async (req: Request, res: Response) => {
        const token = req.headers['authorization'] || ''
        const a = this.parseJwt(token)
        const data = await userService.getMe(a.idUser)
        return res.json(data)
    }

    parseJwt = (token: string) => {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    };

    list = async (req: Request, res: Response) => {
        const data = await userService.list()
        return res.json(data)
    }

    delete = async (req: Request, res: Response) => {
        const { idUser } = req.body
        await userService.delete(idUser)
        const data = await userService.list()
        return res.json(data)
    }




    // get = async (req:Request, res: Response) => {
    //     const response: QueryResult = await pool.query('SELECT * FROM buyUser')
    //     res.status(200).json(response.rows) 
    // }

    // create = async (req:Request, res: Response) => {
    //     const {idUser,nameUser,email,phone} = req.body
    //     const response: QueryResult = await pool.query('INSERT INTO buyUser (idUser,nameUser,email,phone) VALUES ($1,$2,$3,$4)', [idUser,nameUser,email,phone])
    //     return res.json({
    //         message: 'Create a user success'
    //     })
    // }

    // delete = async (req:Request, res: Response) => {
    //     const idUser = req.params.idUser
    //     const response: QueryResult = await pool.query('DELETE FROM buyUser where idUser=$1', [idUser])
    //     return res.json({
    //         message: 'Delete a user success'
    //     })
    // }
}

export const userController = new UserController()