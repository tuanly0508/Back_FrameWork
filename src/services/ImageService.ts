import {pool} from '../database'

class ImageService {

    createImage = async(idProductLine:string,image:string) => {
        await pool.query(`INSERT INTO image values ($1,$2)`,[idProductLine,image])
    }

    deleteImage = async(image:string,idProductLine:string) => {
        await pool.query('DELETE from image where image = $1 and id_product_line = $2', [image,idProductLine])
    }
}

export const imageService = new ImageService()