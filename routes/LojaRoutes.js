import { Router } from "express"
const LojaRoutes = Router()
import LojaController from "../controllers/LojaController.js"
import verifyAdmin from "../helpers/verify-admin.js"

LojaRoutes.post('/register',
    // verifyAdmin,
    LojaController.register)
LojaRoutes.get('/get-all',
    // verifyAdmin, 
    LojaController.getAll)
LojaRoutes.put('/edit/:id',
    // verifyAdmin, 
    LojaController.editLoja)
LojaRoutes.post('/:id',
    // verifyAdmin, 
    LojaController.lojaById)

export default LojaRoutes
