import { Request, Response } from "express";
import { OrderWithUser } from "../model/OrderTemp";
import { orderService } from "../services/OrderService";
import { productService } from "../services/ProductService";

class OrderController {
    //get order
    list = async (req: Request, res:Response) => {
        const {idUser,size,page}  = req.body
        let data = await orderService.list(idUser,page,size)
        
        //page count
        let pageCount = 0
        data.pageCount.rows.map((item) => {
            pageCount = item.case
        })
        
        //list order
        let list: OrderWithUser[] = []
        let listAll = data
        let listIdOrder:string[] = []
        data.listOrder.rows.map((item) => {
            listIdOrder.push(item.id_order)
        })
        listIdOrder = Array.from(new Set(listIdOrder))
        
        listIdOrder.map((item) => {
            const info: OrderWithUser= {
                idOrder: item,
                idUser: '',
                createAt: '' ,
                isTemp: false,
                name: '',
                email:'',
                phone:'',
                address:'',
                status:'',
                orderProduct: [],
                user: {
                    idUser:'',
                    nameUser: '',
                    email:'',
                    phone:'',
                    address: ''
                }  
            }
            listAll.listOrder.rows.map((item2) => {
                if (item === item2.id_order) {
                    info.createAt = item2.create_at ,
                    info.isTemp = false,
                    info.user.idUser = item2.id_user
                    info.user.nameUser = item2.name_user
                    info.user.email = item2.email
                    info.user.phone = item2.phone
                    info.user.address = item2.address
                    info.name = item2.name
                    info.email = item2.email
                    info.phone = item2.phone
                    info.address= item2.address
                    info.status = item2.status
                    info.orderProduct.push({
                        idOrder: item2.id_order,
                        idProduct: item2.id_product,
                        quantity: item2.quantity,
                        product: {
                            idProduct: item2.id_product,
                            idProductLine: item2.id_product_line,
                            weight: item2.name_weight,
                            price: item2.price,
                            name_age: item2.name_age,
                            productLine: {
                                idProductLine: item2.id_product_line,
                                idBrand: item2.id_brand,
                                idCategory: item2.id_category,
                                nameProduct: item2.name_product,
                                sellCount: item2.sell_count,
                                createAt: item2.create_at,
                                updateAt: item2.update_at,
                                image: item2.image
                            }
                        }
                    })
                }
            })
            list.push(info)
        })
        let newList = {list,pageCount}
        return res.json(newList)
    } 

    //update status order
    update = async (req:Request, res: Response) => {
        const {orderTemp,sellCount} = req.body
        await productService.setSellCount(sellCount)
        let data = await orderService.update(orderTemp)
        return res.json(data)
    }

    //create order  
    create = async (req:Request, res: Response) => {
        const {idOrder} = req.body
        let data = await orderService.create(idOrder,'1')
        return res.json(data)
    } 

    get = async (req:Request, res: Response) => {
        let {status} = req.body
        let data = await orderService.get(status)
        return res.json(data)
    }

    updateStatus = async (req:Request, res: Response) => {
        const {idOrder,status,statusGet} = req.body
        await orderService.updateStatus(idOrder,status)
        let data = await orderService.get(statusGet)
        return res.json(data)
    }
}
export const orderController = new OrderController()