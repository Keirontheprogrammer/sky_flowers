// config/db.js
const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'tamandani nsiku',   
    database: 'sky_flowers',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


(async () => {
    try {
        const connection = await db.getConnection();
        console.log("Database connected successfully !!");
        connection.release();
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
})();

module.exports = db;