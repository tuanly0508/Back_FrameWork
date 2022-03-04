import { QueryResult } from 'pg'
import {pool} from '../database'
import {v4 as uuid} from 'uuid'
import { Category } from '../model/Category'

class CategoryService {

    //get category
    list = async() => {
        const response: QueryResult = await pool.query(`select id_category ,name_category, create_at,update_at from category where delete_at is null`)
        return response.rows
    }

    //create    
    create = async(category:Category) => {
        console.log(category);
        
        await pool.query('INSERT INTO category VALUES ($1,$2,$3)', [uuid(),category.name_category,new Date()])
    }

    //delete
    delete = async(id_category:string) => {
        await pool.query('DELETE from category where id_category = $1', [id_category])
    }

    //update
    update = async(category: Category) => {
        await pool.query('UPDATE category set name_category=$1,update_at=$2 where id_category=$3', [category.name_category,new Date(),category.id_category])
    }
}

export const categoryService = new CategoryService()