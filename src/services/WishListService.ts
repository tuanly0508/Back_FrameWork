import { QueryResult } from 'pg'
import {pool} from '../database'
import {v4 as uuid} from 'uuid'
import { WishList } from '../model/WishList'

class WishListService {

    //get 
    get = async(idUser:string) => {
        const response: QueryResult = await pool.query(`select * from wish_list where id_user = $1`,[idUser])
        return response.rows
    }

    create = async(wishList:WishList) => {
        await pool.query('INSERT INTO wish_list VALUES ($1,$2)', [wishList.id_product_line,wishList.id_user])
    }

    delete = async(wishList:WishList) => {
        await pool.query('DELETE FROM wish_list where id_product_line=$1 and id_user = $2', [wishList.id_product_line,wishList.id_user])
    }
}

export const wishListService = new WishListService()