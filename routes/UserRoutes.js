import { Router } from 'express'
const UserRoutes = Router()
import UserController from "../controllers/UserController.js"
import verifyToken from '../helpers/verify-token.js'
import verifyAdmin from '../helpers/verify-admin.js'

UserRoutes.post('/register', UserController.register)
UserRoutes.post('/login', UserController.login)
UserRoutes.post('/user/:id', verifyToken, UserController.getUserById)
UserRoutes.post('/edit/:id', verifyToken, UserController.editUser)

export default UserRoutes