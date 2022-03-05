import { QueryResult } from 'pg'
import {pool} from '../database'
import {v4 as uuid} from 'uuid'
import { User } from '../model/User'

class UserService {

    checkMail = async(email:string) => { 
        const response: QueryResult = await pool.query('select * from users where email = $1 and delete_at is null',[email])
        return response.rows[0]
    }
    
    //register
    register = async(user:User,hashPass:string) => {
        const id = uuid()
        await pool.query('insert into users values ($1,$2,$3,$4,$5,$6,$7,$8)', [id,user.name_user,user.email,user.phone,user.address,user.role,hashPass,new Date()])
        await pool.query('insert into order_temp values ($1,$2,$3)',[uuid(),id,new Date()])
    }

    delete = async(idUser:string) => {
        await pool.query('delete from order_temp where id_user = $1', [idUser])
        await pool.query('delete from users where id_user = $1', [idUser])
    }

    //login
    login = async(email:string,pass:string) => {
        const response: QueryResult = await pool.query(`select * from users where email = $1 and pass = $2 and delete_at is null`, [email,pass])
        return response.rows[0]
    }

    //get
    list = async() => {
        const response: QueryResult = await pool.query('select id_user,name_user ,email ,phone ,address,create_at ,update_at from users order by create_at desc')
        return response.rows
    }

    //update
    update = async(user:User) => {
        await pool.query('UPDATE users set name_user=$1,email=$2,phone=$3,address=$4,update_at=$5 where id_user=$6', [user.name_user,user.email,user.phone,user.address,new Date(),user.id_user])
    }

    //get me
    getMe = async(idUser:string) => {
        const response: QueryResult = await pool.query(`select b.id_user,a.id_order,a.create_at,a.is_temp,a.name,a.email,a.phone,a.address,a.status,b.name_user,b.role
        from users b left join order_temp a on a.id_user = b.id_user where b.id_user = $1 and b.delete_at is null and a.is_temp = true`, [idUser])
        return response.rows
    }
}

export const userService = new UserService()