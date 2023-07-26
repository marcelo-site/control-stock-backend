import { DataTypes  } from "sequelize";
import { sequelize } from '../db/conn.js';
const db = sequelize
import Loja from "./Loja.js";
import Product_size_color from "./Product_size_color.js";

const Stock = db.define('stock', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey : true
    },
    stock : {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { freezeTableName: true, timestamps: false})

Loja.hasMany(Stock)
Stock.belongsTo(Loja)

Product_size_color.hasMany(Stock)
Stock.belongsTo(Product_size_color)

export default Stock