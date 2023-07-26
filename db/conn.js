import { Sequelize } from "sequelize";
import { DB_HOST, DB_NAME,DB_PASSWORD, DB_USER, DB_PORT } from "../config.js";

export const sequelize = new Sequelize(DB_NAME , DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    timezone: '-03:00',
})

try {
    sequelize.authenticate()
    console.log(DB_HOST)

} catch (error) {
    console.log(`Não foi possível conectar: ${error}`)
}