import { QueryResult } from 'pg'
import { pool } from '../database'
import { v4 as uuid } from 'uuid'

class ProductService {
    //product user
    list = async (search: string, field: string, sort: string, page: number, size: number) => {
        const listProduct: QueryResult = await pool.query(`
            SELECT * FROM (select distinct on(a.id_product_line) * from (select 
                    a.id_product_line, a.id_brand,a.id_category,a.name_product,a.sell_count,a.create_at,a.update_at,a.delete_at,
                    b.id_product ,b.id_weight ,b.price ,b.id_age ,c.image ,d.name_brand ,e.name_category
                from 
                    product_line a join product b on a.id_product_line = b.id_product_line join image c on c.id_product_line=b.id_product_line 
                    join brand d on d.id_brand = a.id_brand join category e on e.id_category = a.id_category
                where
                    case when $2 = 'name_brand' then d.name_brand = '`+ search +`' else 
                        case when length($1) > 0 then name_product ilike '%`+ search + `%' else name_product ilike '%%' end
                    end
                )as a
            )as t 
            order by
                case when $2 = 'name_product' and $3 = 'desc' then name_product end desc,
                case when $2 = 'name_product' and $3 = 'asc' then name_product end,
                case when $2 = 'price' and $3 = 'desc' then price end desc,
                case when $2 = 'price' and $3 = 'asc' then price end,
                case when $2 = 'sellCount' and $3 = 'desc' then sell_count end desc,
                case when $2 = 'sellCount' and $3 = 'asc' then sell_count end
            OFFSET (($4-1)*$5) rows FETCH NEXT $5 ROWS only `, [search, field, sort, page, size])

        const pageCount: QueryResult = await pool.query('select CASE when count(*)%$1 = 0 then count(*)/$1 else count(*)/$1+1 end from product_line where delete_at is null', [size])
        const a: QueryResult = await pool.query('select name_brand from brand where delete_at is null')
        const brand = a.rows
        return { listProduct, pageCount, brand }
    }

    create = async (idProductLine: string, idBrand: string, idCategory: string, nameProduct: string, image: string[]) => {
        await pool.query(`INSERT INTO product_line values ($1,$2,$3,$4,0,$5)`, [idProductLine, idBrand, idCategory, nameProduct, new Date()])
        image.map(async (item) => {
            await pool.query(`INSERT INTO image values ($1,$2)`, [idProductLine, item])
        })
    }

    getById = async (idProductLine: string) => {
        const a: QueryResult = await pool.query(`
            select a.id_product ,a.id_product_line ,a.id_weight ,a.price ,b.name_product,c.name_brand,b.sell_count from product a join product_line b on a.id_product_line = b.id_product_line 
            join brand c on c.id_brand = b.id_brand
            where a.id_product_line = $1 and a.delete_at is null
        `, [idProductLine])
        const b: QueryResult = await pool.query(`select image from image where id_product_line = $1`, [idProductLine])
        const c: QueryResult = await pool.query(` select distinct on(id_weight) id_product ,a.id_product_line ,a.id_weight,name_weight from product a join weight c on c.id_weight=a.id_weight 
        where a.id_product_line = $1 and a.delete_at is null order by id_weight `, [idProductLine]
        )
        const d: QueryResult = await pool.query(`select id_product ,a.id_product_line ,a.id_age,name_age ,id_weight
        from product a join age b on a.id_age = b.id_age where id_product_line = $1 and b.delete_at is null order by id_weight`, [idProductLine])
        const product = a.rows
        const image = b.rows
        const weight = c.rows
        const age = d.rows
        return { product, image, weight, age }
    }
        
    delete = async (idProductLine: string, idProduct: string) => {
        await pool.query('UPDATE product set delete_at=$1 where id_product=$2', [new Date(), idProduct])
        await pool.query('UPDATE product_line set delete_at=$1 where id_product_line=$2', [new Date(), idProductLine])
    }

    update = async (nameProduct: string, price: number, image: string, idProduct: string, idBrand: string, idCategory: string, idWeight: string, idProductLine: string) => {
        await pool.query('UPDATE product_line set id_brand=$1,id_category=$2,name_product=$3,update_at=$4 where id_product_line=$5', [idBrand, idCategory, nameProduct, new Date(), idProductLine])
        await pool.query('UPDATE product set id_product_line=$1,id_weight=$2,price=$3,update_at=$4 where id_product=$5', [idProductLine, idWeight, price, new Date(), idProduct])
        await pool.query('UPDATE image set image=$1 where id_product_line=$2', [image, idProductLine])
    }

    // product line
    get = async (size: number, page: number, search: string, field: string, sort: string) => {
        const listProduct: QueryResult = await pool.query(`
        select a.id_product_line ,a.name_product ,b.name_brand ,c.name_category ,a.create_at ,a.update_at 
        from product_line a join brand b on a.id_brand = b.id_brand join category c on c.id_category = a.id_category
        where a.delete_at is null and
	        case when length($1) > 0 then name_product ilike '%`+ search + `%' else name_product ilike '%%' end or
            case when $2 = 'name_brand' then name_brand = '`+ search + `' end
        order by
            case when $2 = 'name_product' and $3 = 'desc' then name_product end desc,
            case when $2 = 'name_product' and $3 = 'asc' then name_product end,
            case when $2 = 'create_at' and $3 = 'desc' then a.create_at end desc,
            case when $2 = 'create_at' and $3 = 'asc' then a.create_at end,
            case when $2 = 'update_at' and $3 = 'desc' then a.update_at end desc,
            case when $2 = 'update_at' and $3 = 'asc' then a.update_at end,
            case when $2 = '' and $3 = '' then a.create_at end desc
            OFFSET (($4-1)*$5) rows FETCH NEXT $5 ROWS only`,
            [search, field, sort, page, size])

        const pageCount: QueryResult = await pool.query('select CASE when count(*)%$1 = 0 then count(*)/$1 else count(*)/$1+1 end from product_line where delete_at is null', [size])
        return { listProduct, pageCount }
    }

    deleteProductLine = async (idProductLine: string) => {
        await pool.query('UPDATE product_line set delete_at=$1 where id_product_line = $2', [new Date(), idProductLine])
    }

    getByIdProductLine = async (idProductLine: string) => {
        const a: QueryResult = await pool.query(`
        select id_product_line ,b.name_category ,c.name_brand ,name_product 
        from product_line a join category b on a.id_category = b.id_category join brand c on c.id_brand = a.id_brand
        where id_product_line = $1
        `, [idProductLine])
        const b: QueryResult = await pool.query(`select id_product_line,image from image where id_product_line = $1`, [idProductLine])
        const product = a.rows
        const image = b.rows
        return { product, image }
    }

    updateProductLine = async (nameProduct: string, idBrand: string, idCategory: string, idProductLine: string) => {
        const a: QueryResult = await pool.query(`
        UPDATE product_line set name_product=$1,id_brand=$2,id_category=$3,update_at=$5 where id_product_line = $4
        `, [nameProduct, idBrand, idCategory, idProductLine, new Date()])
    }

    setSellCount = async (sellCount: { idProductLine: string, sellCount: number }[]) => {
        sellCount.map(async (item) => {
            const a: QueryResult = await pool.query(`
            UPDATE product_line set sell_count=sell_count+$1 where id_product_line = $2
            `, [item.sellCount, item.idProductLine])
        })
    }

    // product
    getProduct = async (idProductLine: string) => {
        const listProduct: QueryResult = await pool.query(`
        select a.id_product ,a.id_product_line,c.name_product ,b.name_weight ,a.price ,a.create_at ,a.update_at ,a.id_weight,d.id_age,d.name_age
        from product a join weight b on a.id_weight =b.id_weight join product_line c on c.id_product_line = a.id_product_line 
        join age d on d.id_age = a.id_age
        where a.id_product_line = $1 and a.delete_at is null order by a.id_weight,d.id_age`,
            [idProductLine])
        return listProduct.rows
    }

    updateProduct = async (idProduct: string, idWeight: string, price: number, idAge: string) => {
        await pool.query(` UPDATE product set id_weight=$1,price=$2,id_age=$4 where id_product = $3 `, [idWeight, price, idProduct, idAge])
    }

    createProduct = async (idProductLine: string, idWeight: string, price: number, idAge: string) => {
        await pool.query(`INSERT INTO product values ($1,$2,$3,$4,$5,$6)`, [uuid(), idProductLine, idWeight, price, idAge, new Date()])
    }

    deleteProduct = async (idProduct: string) => {
        await pool.query(` UPDATE product set delete_at=$1 where id_product = $2  `, [new Date(), idProduct])
    }
}

export const productService = new ProductService()