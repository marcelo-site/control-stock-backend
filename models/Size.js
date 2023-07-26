import { DataTypes  } from "sequelize";
import { sequelize } from '../db/conn.js';
import Color from "./Color.js";
import SizeColor from "./SizeColor.js";
const db = sequelize

const Size = db.define('size', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey : true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { timestamps: false})

Size.belongsToMany(Color, {
    through: {
        model: SizeColor
    }
})
Color.belongsToMany(Size, {
    through: {
        model: SizeColor
    }
})

Color.hasMany(SizeColor)
SizeColor.belongsTo(Color)
Size.hasMany(SizeColor)
SizeColor.belongsTo(Size)

export default Size