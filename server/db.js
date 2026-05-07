require("dotenv").config()
// ↑ esta mielda lee el .env

const mysql = require("mysql2")

// const host = process.env.HOST;
// const user = process.env.USER;
// const password = process.env.PASSWORD;
// const database = process.env.DATABASE;

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
})

db.connect((err) => {
    if (err) {
        console.error("Error al conectar a la base de datos:", err)
    } else {
        console.log("Conexión a la base de datos establecida")
    }
})

module.exports = db