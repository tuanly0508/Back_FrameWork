import { QueryResult } from 'pg'
import {pool} from '../database'
import {v4 as uuid} from 'uuid'

class AgeService {

    //get 
    get = async() => {
        const response: QueryResult = await pool.query(`select id_age ,name_age from age where delete_at is null`)
        return response.rows
    }

  
    create = async(nameBrand:string) => {
        await pool.query('INSERT INTO brand VALUES ($1,$2,$3)', [uuid(),nameBrand,new Date()])
    }


    delete = async(idBrand:string) => {
        await pool.query('UPDATE brand set delete_at=$1 where id_brand=$2', [new Date(),idBrand])
    }


    update = async(idBrand:string,nameBrand:string) => {
        await pool.query('UPDATE brand set name_brand=$1,update_at=$2 where id_brand=$3', [nameBrand,new Date(),idBrand])
    }
}

export const ageService = new AgeService()