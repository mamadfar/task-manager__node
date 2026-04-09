import mysql from 'mysql2/promise'

const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

const conn = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
})

export default conn;