import { Request, Response } from "express";
import {QueryResult} from 'pg'
import {pool} from '../database'
import { Pagination } from "../model/Pagination";
import { productService } from "../services/ProductService";
import {v4 as uuid} from 'uuid'

class ProductController {

    //product user
    list = async (req:Request, res: Response) => {  
        const listData : Pagination = req.body
        const {size,page,field,sort,search} = listData
        page||1
        let data = await productService.list(search as string,field as string,sort as string,page,size)
        let dataProduct = data.listProduct.rows
        let brand = data.brand
        let pageCount = 0
        data.pageCount.rows.map((item) => {
            pageCount = item.case
        })
        let newList = {dataProduct,pageCount,brand}
        return res.json(newList)
    }    

    getById = async (req:Request, res: Response) => {
        const {idProductLine} = req.body
        let data = await productService.getById(idProductLine)
        res.status(200).json(data) 
    }

    delete = async (req:Request, res: Response) => {
        const {idProductLine,idProduct} = req.body
        await productService.delete(idProductLine,idProduct)
        await this.list(req,res)
    }

    update = async (req:Request, res: Response) => {
        const idProduct = req.params.idProduct
        const {nameProduct,price,image,size,page} = req.body
        //await productService.update(nameProduct,price,image,idProduct)
        const response: QueryResult = await pool.query('SELECT * FROM product')
        return res.json(response.rows)
    }

    // product line 
    getProductLine = async (req:Request, res: Response) => {
        const {size,page,search,field,sort} = req.body
        let data = await productService.get(size,page,search,field,sort)
        let dataProduct = data.listProduct.rows
        let pageCount = 0
        data.pageCount.rows.map((item) => {
            pageCount = item.case
        })
        let newList = {dataProduct,pageCount}
        return res.json(newList)
    }

    createProductLine = async (req:Request, res: Response) => {
        const {product,pagination} = req.body
        await productService.create(uuid(),product.idBrand,product.idCategory,product.nameProduct,product.image)
        let data = await productService.get(pagination.size,pagination.page,'','','')
        let dataProduct = data.listProduct.rows
        let pageCount = 0
        data.pageCount.rows.map((item) => {
            pageCount = item.case
        })
        let newList = {dataProduct,pageCount}
        return res.json(newList)
    }

    updateProductLine = async (req:Request, res: Response) => {
        const {nameProduct,idBrand,idCategory,idProductLine,pagination} = req.body
        await productService.updateProductLine(nameProduct,idBrand,idCategory,idProductLine)
        let data = await productService.get(pagination.size,pagination.page,'','','')
        let dataProduct = data.listProduct.rows
        let pageCount = 0
        data.pageCount.rows.map((item) => {
            pageCount = item.case
        })
        let newList = {dataProduct,pageCount}
        
        return res.json(newList)
    }

    deleteProductLine = async (req:Request, res: Response) => {
        const {idProductLine,pagination} = req.body
        await productService.deleteProductLine(idProductLine)
        let data = await productService.get(pagination.size,pagination.page,'','','')
        let dataProduct = data.listProduct.rows
        let pageCount = 0
        data.pageCount.rows.map((item) => {
            pageCount = item.case
        })
        let newList = {dataProduct,pageCount}
        
        return res.json(newList)
    }

    getByIdProductLine = async (req:Request, res: Response) => {
        const idProductLine = req.body.idProductLine
        let data = await productService.getByIdProductLine(idProductLine)
        return res.json(data) 
    }

    //product
    getProduct = async (req:Request, res: Response) => {
        const idProductLine = req.body.idProductLine
        const a = await productService.getProduct(idProductLine)
        return res.json(a)
    }

    createProduct = async (req:Request, res: Response) => {
        const {product} = req.body
        await productService.createProduct(product.id_product_line,product.id_weight,product.price,product.id_age)
        const response = await productService.getProduct(product.id_product_line)
        return res.json(response)
    }

    updateProduct = async (req:Request, res: Response) => {
        const {idProduct,idWeight,price,idProductLine,idAge} = req.body
        await productService.updateProduct(idProduct,idWeight,price,idAge)
        const response = await productService.getProduct(idProductLine)
        return res.json(response)
    }

    deleteProduct = async (req:Request, res: Response) => {
        const {idProduct,idProductLine} = req.body
        await productService.deleteProduct(idProduct)
        const response = await productService.getProduct(idProductLine)
        return res.json(response)
    }
}
export const productController = new ProductController()