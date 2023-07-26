import { Router } from "express";
const ProductRoutes = Router()
import { imageUpload } from "../helpers/file-upload.js";
import verifyAdmin from "../helpers/verify-admin.js";

import ProductController from "../controllers/ProductController.js";
import verifyToken from "../helpers/verify-token.js";

ProductRoutes.get('/', ProductController.getAll)
ProductRoutes.patch('/edit-stock/:id', verifyToken,
    // verifyAdmin, 
    ProductController.changeQty)
ProductRoutes.delete('/delete/:id',verifyAdmin,ProductController.delete)
ProductRoutes.post('/register', imageUpload.single('image'), ProductController.register)
ProductRoutes.patch('/edit/:id', imageUpload.single('image'), verifyAdmin,
    ProductController.editProduct)

ProductRoutes.get('/unique-all/:id', verifyToken, ProductController.productByIdAll)

ProductRoutes.get('/:id', verifyToken, /* verifyAdmin, */ ProductController.productById)
ProductRoutes.post('/add-stock/:id', verifyToken, ProductController.addColorstock)
ProductRoutes.post('/create-color', verifyAdmin, ProductController.createColor)

export default ProductRoutes