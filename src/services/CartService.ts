import { QueryResult } from 'pg'
import {pool} from '../database'
import { Cart } from '../model/Cart'

class CartService {

    //get card
    get = async(idUser: string) => {
        const response: QueryResult = await pool.query(`
        select distinct on(b.id_product) a.id_order,b.id_product,e.name_product ,b.price ,a.quantity,d.name_weight,f.image ,g.name_age,b.id_product_line
        from order_product a join product b on a.id_product = b.id_product join order_temp c on c.id_order =a.id_order 
            join weight d on d.id_weight = b.id_weight join product_line e on e.id_product_line = b.id_product_line 
            join image f on f.id_product_line = e.id_product_line join age g on g.id_age = b.id_age
        where c.id_user = $1 and is_temp = true order by b.id_product `, [idUser])
        return response.rows
    }
    
    //check
    checkEmpty = async() => {
        const response: QueryResult = await pool.query('select b.id_order, a.id_product from order_product a join order_temp b on a.id_order = b.id_order where b.is_temp = true')
        return response.rows
    }

    //create    
    create = async(idOrder:string|number,cart:Cart) => {
        await pool.query('INSERT INTO order_product VALUES ($1,$2,$3)', [idOrder,cart.idProduct,cart.quantity])
    }

    //delete
    delete = async(cart:Cart) => {
        const response: QueryResult = await pool.query('DELETE FROM order_product where id_product=$1 and id_order = $2', [cart.idProduct,cart.idOrder])
        return response.rows
    }

    //update
    update = async(cart:Cart) => {
        await pool.query('UPDATE order_product set quantity=$1 where id_product=$2 and id_order =$3 ', [cart.quantity,cart.idProduct,cart.idOrder])
    }
}

export const cartService = new CartService()