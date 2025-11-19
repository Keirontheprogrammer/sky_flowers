const db = require("../config/db");

module.exports ={
    createCustomer: (name, phone_number)=> db.query(
        "INSERT INTO customers (name, phone_number) VALUES(?,?)",[name, phone_number]
    ),
    
    getCustomerById: (id) =>
        db.query("SELECT * FROM customers WHERE customer_id = ?",[id]),

    getCustomerByPhone: (phone_number) => db.query("SELECT * FROM customers WHERE phone_number = ?",[phone_number]),

    getCustomerOrders: (customer_id) =>
        db.query(`
            SELECT o.*, oi.number_of_items, f.name, f.price, f.color
            FROM orders o
            JOIN order_items oi ON o.order_id = oi.order_id
            JOIN flowers f ON oi.flower_id = f.flower_id
            WHERE o.customer_id = ?
            ORDER BY o.order_date DESC
        `, [customer_id]),

    getAllCustomers: ()=> db.query("SELECT * FROM customers ORDER BY customer_id DESC") 
};

