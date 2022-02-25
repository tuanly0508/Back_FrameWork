import { Router } from "express";
import { brandController } from "../controller/BrandController";
import { cartController } from "../controller/CartController";
import { categoryController } from "../controller/CategoryController";
import { ageController } from "../controller/AgeController";
import { imageController } from "../controller/ImageController";
import { orderController } from "../controller/OrderController";
import { productController } from "../controller/ProductController";
import { userController } from "../controller/UserController";
import { weightController } from "../controller/WeightController";
import { wishListController } from "../controller/WishListController";

const router = Router()

//user
router.post('/users/register', userController.register)
router.post('/users/login', userController.login)
router.put('/users/update', userController.update)
router.get('/users/detail/:idUser', userController.getById)
router.get('/users/getMe' ,userController.authToken,userController.getMe)
// router.get('/users', userController.get);
// router.post('/users/create', userController.create)
// router.get('/users/delete/:idUser', userController.delete)

//product user
router.post('/product/list', productController.list)
router.post('/product/detail', productController.getById)
router.post('/product/delete', productController.delete)
router.put('/product/update/:idProduct/:idOrder', productController.update)


//product line
router.post('/product-line/get', userController.authToken,userController.checkAdmin,productController.getProductLine)
router.post('/product-line/create',productController.createProductLine)
router.post('/product-line/delete', productController.deleteProductLine)
router.put('/product-line/update', productController.updateProductLine)
router.post('/product-line/get-by-id', productController.getByIdProductLine)

//product
router.post('/product-admin/get', productController.getProduct)
router.put('/product-admin/update', productController.updateProduct)
router.post('/product-admin/create', productController.createProduct)
router.post('/product-admin/delete', productController.deleteProduct)

//cart
router.get('/cart', userController.authToken,cartController.get)
router.post('/cart/create', cartController.create)
router.post('/cart/delete', cartController.delete)
router.put('/cart/update', cartController.update) 

//order
router.post('/order', orderController.list)
router.put('/order/update', orderController.update)
router.post('/order/create', orderController.create)

//order admin 
router.post('/order/get', orderController.get)
router.put('/order/updateStatus', orderController.updateStatus)

//image
router.post('/image/create', imageController.createImage)
router.post('/image/delete', imageController.deleteImage)

//brand
router.get('/brand', brandController.get)

//category
router.get('/category', categoryController.get)

//weight
router.get('/weight/:idProductLine', weightController.list)
router.get('/weight', weightController.get)

//color 
router.get('/age', ageController.get)

//wish list
router.post('/wishlist', wishListController.get)
router.put('/wishlist/update', wishListController.update)
router.post('/wishlist/create', wishListController.create)
router.post('/wishlist/delete', wishListController.delete)

export default router;