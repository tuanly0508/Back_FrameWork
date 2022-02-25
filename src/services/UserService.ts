import { QueryResult } from 'pg'
import {pool} from '../database'
import {v4 as uuid} from 'uuid'

class UserService {
    
    //register
    register = async(nameUser:string,email:string,phone:string,address:string,pass:string) => {
        await pool.query('insert into users values ($1,$2,$3,$4,$5,default,$6,$7)', [uuid(),nameUser,email,phone,address,pass,new Date()])
    }

    //login
    login = async(email:string,pass:string) => {
        const response: QueryResult = await pool.query(`select * from users where email = $1 and pass = $2 and delete_at is null`, [email,pass])
        return response.rows[0]
    }

    //get
    get = async() => {
        const response: QueryResult = await pool.query('select id_user,name_user ,email ,phone ,address from users where delete_at is null')
        return response.rows
    }

    //update
    update = async(nameUser:string,email:string,phone:string,address:string,idUser: string) => {
        await pool.query('UPDATE users set name_user=$1,email=$2,phone=$3,address=$4,update_at=$5 where id_user=$6', [nameUser,email,phone,address,new Date(),idUser])
    }

    //get me
    getMe = async(idUser:string) => {
        const response: QueryResult = await pool.query(`select b.id_user,a.id_order,a.create_at,a.is_temp,a.name,a.email,a.phone,a.address,a.status,b.name_user,b.role
        from users b left join order_temp a on a.id_user = b.id_user where b.id_user = $1 and b.delete_at is null and a.is_temp = true`, [idUser])
        return response.rows
    }
}

export const userService = new UserService()