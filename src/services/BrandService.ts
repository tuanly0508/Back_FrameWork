import { QueryResult } from 'pg'
import {pool} from '../database'
import {v4 as uuid} from 'uuid'

class BrandService {

    //get 
    get = async() => {
        const response: QueryResult = await pool.query(`select id_brand ,name_brand from brand where delete_at is null`)
        return response.rows
    }

    //create    
    create = async(nameBrand:string) => {
        await pool.query('INSERT INTO brand VALUES ($1,$2,$3)', [uuid(),nameBrand,new Date()])
    }

    //delete
    delete = async(idBrand:string) => {
        await pool.query('UPDATE brand set delete_at=$1 where id_brand=$2', [new Date(),idBrand])
    }

    //update
    update = async(idBrand:string,nameBrand:string) => {
        await pool.query('UPDATE brand set name_brand=$1,update_at=$2 where id_brand=$3', [nameBrand,new Date(),idBrand])
    }
}

export const brandService = new BrandService()