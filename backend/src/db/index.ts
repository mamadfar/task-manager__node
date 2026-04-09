import {Sequelize} from '@sequelize/core';
import { MySqlDialect } from '@sequelize/mysql';

const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT } = process.env;

const sequelize = new Sequelize({
    host: DB_HOST,
    dialect: MySqlDialect,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASS,
    port: Number(DB_PORT),
    logging: false
})

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.log((error as Error).message);
    process.exit();
}

export default sequelize;