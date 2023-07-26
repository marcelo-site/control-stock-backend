import { DataTypes } from "sequelize";
import { sequelize } from '../db/conn.js';
import SizeColor from "./SizeColor.js";
import Product_size_color from "./Product_size_color.js";
const db = sequelize

const Product = db.define('product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ref: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

Product.belongsToMany(SizeColor, {
    through: {
        model: Product_size_color
    }
})
SizeColor.belongsToMany(Product, {
    through: {
        model: Product_size_color
    }
})

Product.hasMany(Product_size_color)
Product_size_color.belongsTo(Product)

SizeColor.hasMany(Product_size_color)
Product_size_color.belongsTo(SizeColor)
export default Product
