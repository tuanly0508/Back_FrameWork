import { QueryResult } from 'pg'
import {pool} from '../database'
import {v4 as uuid} from 'uuid'

class WeightService {

    //get 
    list = async(idProductLine:string) => {
        const response: QueryResult = await pool.query(`
            select id_product ,a.id_product_line ,a.id_weight,name_weight 
            from product a join weight c on c.id_weight=a.id_weight 
            where a.id_product_line = $1 and a.delete_at is null
        `,[idProductLine])
        return response.rows
    }

    //get 
    get = async() => {
        const response: QueryResult = await pool.query(`select id_weight ,name_weight from weight where delete_at is null`)
        return response.rows
    }

    //create    
    create = async(nameWeight:string) => {
        await pool.query('INSERT INTO weight VALUES ($1,$2,$3)', [uuid(),nameWeight,new Date()])
    }

    //delete
    delete = async(idWeight:string) => {
        await pool.query('UPDATE weight set delete_at=$1 where id_weight=$2', [new Date(),idWeight])
    }

    //update
    update = async(idWeight:string,nameWeight:string) => {
        await pool.query('UPDATE weight set name_weight=$1,update_at=$2 where id_weight=$3', [nameWeight,new Date(),idWeight])
    }
}

export const weightService = new WeightService()