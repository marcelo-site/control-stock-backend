import { DataTypes  } from "sequelize";
import { sequelize } from '../db/conn.js';
const db = sequelize

const Product_size_color = db.define('product_size_color', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey : true
    }
}, { timestamps: false})

export default Product_size_color