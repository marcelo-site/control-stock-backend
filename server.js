import express from 'express'
import { sequelize } from './db/conn.js'
const conn = sequelize
import cors from 'cors'
const app = express()

// Config json
app.use(express.json())

// Solve cors
const frontend = process.env.FRONTEND
console.log(frontend)
app.use(cors({ credentials: true, origin: frontend}))

// Public folders for image
app.use(express.static('public'))

// modelss
import Product from './models/Product.js'
import Loja from './models/Loja.js'
import User from './models/User.js'
import Color from './models/Color.js'
import Stock from './models/Stock.js'
import Size from './models/Size.js'
import SizeColor from './models/SizeColor.js'


// Routes
import UserRoutes from './routes/UserRoutes.js'
import LojaRoutes from './routes/LojaRoutes.js'
import ProductRoutes from './routes/ProductRoutes.js'
// import User from './models/User.js'
app.use('/users', UserRoutes)
app.use('/loja', LojaRoutes)
app.use('/products', ProductRoutes)


// app.listen(5000)
const PORT = process.env.PORT || 5000;
// Conexão com o banco
conn.sync().then(() => { app.listen(PORT) })
    .catch((error) => console.log(error))