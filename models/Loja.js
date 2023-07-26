import { DataTypes } from "sequelize";
import { sequelize } from '../db/conn.js';
import User from "./User.js";
const db = sequelize

const Loja = db.define('loja', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    address: {
        type: DataTypes.STRING(10),
        allowNull: false
    }
}, { freezeTableName: true, timestamps: false })

Loja.hasOne(User)
User.belongsTo(Loja)

export default Loja

