import { QueryResult } from 'pg'
import {pool} from '../database'
import {v4 as uuid} from 'uuid'

class CategoryService {

    //get category
    get = async() => {
        const response: QueryResult = await pool.query(`select id_category ,name_category from category where delete_at is null`)
        return response.rows
    }

    //create    
    create = async(nameCategory:string) => {
        await pool.query('INSERT INTO category VALUES ($1,$2,$3)', [uuid(),nameCategory,new Date()])
    }

    //delete
    delete = async(idCategory:string) => {
        await pool.query('UPDATE category set delete_at=$1 where id_category=$2', [new Date(),idCategory])
    }

    //update
    update = async(idCategory:string,nameCategory:string) => {
        await pool.query('UPDATE category set name_category=$1,update_at=$2 where id_category=$3', [nameCategory,new Date(),idCategory])
    }
}

export const categoryService = new CategoryService()