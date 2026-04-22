const mysql = require("mysql2")

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "poi_chat"
})

db.connect((err) => {
    if (err) {
        console.error("Error al conectar a la base de datos:", err)
    } else {
        console.log("Conexión a la base de datos establecida")
    }
})

module.exports = db