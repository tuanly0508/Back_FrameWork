import { v4 as uuid } from 'uuid'
import { QueryResult } from 'pg'
import { pool } from '../database'
import { OrderTemp } from '../model/OrderTemp'

var nodemailer = require('nodemailer');
class OrderService {

    //pagination
    list = async (idUser: string, page: number, size: number) => {
        const listOrder: QueryResult = await pool.query(`
        select distinct on(b.id_product) a.id_order,b.id_product ,quantity ,c.price,e.name_product,f.image,
                        a.name,a.email ,a.phone ,a.address ,g.name_weight,a.create_at ,a.status,h.name_age
        from order_temp a join order_product b on a.id_order = b.id_order join product c on c.id_product = b.id_product 
                        join product_line e on e.id_product_line = c.id_product_line 
                        join image f on f.id_product_line = e.id_product_line join weight g on g.id_weight = c.id_weight join age h on h.id_age = c.id_age
        where is_temp = false and a.id_user = $1 and a.id_order
        in ( SELECT id_order FROM order_temp where is_temp = false and id_user=$1 order by create_at desc OFFSET (($2-1)*$3) rows FETCH NEXT $3 ROWS only )
        order by b.id_product ,create_at desc
        `, [idUser, page, size])
        const pageCount: QueryResult = await pool.query('select CASE when count(*)%$1 = 0 then count(*)/$1 else count(*)/$1+1 end from order_temp where is_temp = false and id_user=$2', [size,idUser])
        return { listOrder, pageCount }
    }

    //create
    create = async (idOrder: string, idUser: string) => {
        await pool.query('INSERT INTO order_temp VALUES ($1,$2,$3)', [idOrder, idUser, new Date()])
    }

    //check
    checkEmpty = async (idUser:string) => {
        const e: QueryResult = await pool.query('select count(*) from order_temp where is_temp = true and id_user=$1',[idUser])
        let i = 0
        e.rows.map((item) => {
            i = parseInt(item.count)
        })
        let id = ''
        if (i === 0) {
            this.create(uuid(), idUser)
            const e: QueryResult = await pool.query('select * from order_temp where is_temp = true and id_user=$1',[idUser])
            e.rows.map((item) => {
                id = item.id_order
            })
            return id
        } else {
            const y: QueryResult = await pool.query('SELECT id_order from order_temp where is_temp = true and id_user=$1',[idUser])
            y.rows.map((item) => {
                id = item.id_order
            })
            return id
        }
    }

    //update
    update = async (orderTemp: OrderTemp) => {    
        await pool.query('UPDATE order_temp set is_temp = false, create_at =$3,name=$4,phone=$5,address=$6,status=$7,email=$8 where id_order = $1 and id_user = $2',
            [orderTemp.idOrder, orderTemp.idUser, new Date(), orderTemp.name, orderTemp.phone, orderTemp.address, 'Pending', orderTemp.email])
        await pool.query('insert into order_temp values ($1,$2,$3)',[uuid(),orderTemp.idUser,new Date()])
        
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'sikienbmto1@gmail.com',
              pass: '01263500'
            }
          });
          
          var mailOptions = {
            from: 'CatchyShop',
            to: orderTemp.email,
            subject: 'Sending Email using Node.js',
            text: 'That was easy!'
          };
          
          transporter.sendMail(mailOptions, function(error:any, info:any){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    }

    //get page admin
    get = async (status:string): Promise<OrderTemp[]> => {    
        const response: QueryResult = await pool.query('select id_order as "idOrder",create_at as "createAt","name" ,phone,status from order_temp where status = $1 ', [status])
        return response.rows
    }

    updateStatus = async (idOrder: string,status:string) => {    
        await pool.query('UPDATE order_temp set status = $1 where id_order = $2',[status,idOrder])
    }
    
}

export const orderService = new OrderService()