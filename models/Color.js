import { DataTypes  } from "sequelize";
import { sequelize } from '../db/conn.js';
const db = sequelize

const Color = db.define('color', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey : true
    },
    name: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { freezeTableName: true, timestamps: false})

export default Color