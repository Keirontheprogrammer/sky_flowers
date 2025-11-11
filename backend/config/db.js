const mysql = require('mysql2');

const db = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : 'tamandani nsiku',
    database : 'sky_flowers',
    connectionLimit : 1,
});

db.getConnection((err, connection)=>{
    if (err){
        console.log("Database connection failed :", err.message);

    }
    else{
        console.log("Database connected successfully !!");
        connection.release();
    }
});

module.exports = db;