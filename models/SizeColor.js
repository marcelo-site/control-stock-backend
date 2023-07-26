import { DataTypes  } from "sequelize";
import { sequelize } from '../db/conn.js';
const db = sequelize

const SizeColor = db.define('size_color', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey : true
    }
}, { freezeTableName: true, timestamps: false})

export default SizeColor