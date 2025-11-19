const db = require('../config/db');

module.exports = {
    createOrder: (customer_id) =>
        db.query(
            `INSERT INTO orders (customer_id, order_date) 
             VALUES (?, NOW())`,
            [customer_id]
        ),

    addOrderItem : (order_id,flower_id, quantity =1)=>
        db.query(
            "INSERT INTO order_items (order_id, flower_id, number_of_items) VALUES (?,?,?)", [order_id, flower_id, quantity]
        ),

    getOrderById: (order_id) =>
        db.query(
            `SELECT 
                o.order_id,
                o.order_date,
                o.customer_id,
                c.name AS customer_name,
                c.phone_number,
                f.flower_id,
                f.name AS flower_name,
                f.price,
                f.colors,
                oi.number_of_items,
                (f.price * oi.number_of_items) AS line_total
            FROM orders o
            JOIN customers c ON o.customer_id = c.customer_id
             JOIN order_items oi ON o.order_id = oi.order_id
             JOIN flowers f ON oi.flower_id = f.flower_id
             WHERE o.order_id = ?
             ORDER BY oi.order_items_id`,
            [order_id]
        ),

    getCustomerOrders: (customer_id) =>
        db.query(
            `SELECT 
                o.order_id, o.order_date,
                SUM(f.price * oi.number_of_items) AS total_amount,
                COUNT(oi.flower_id) AS items_count
             FROM orders o
             JOIN order_items oi ON o.order_id = oi.order_id
             JOIN flowers f ON oi.flower_id = f.flower_id
             WHERE o.customer_id = ?
             GROUP BY o.order_id
             ORDER BY o.order_date DESC`,
            [customer_id]
        ),

    getAllOrders: () =>
        db.query(
            `SELECT 
                o.order_id, o.order_date,
                c.name AS customer_name, c.phone_number,
                SUM(f.price * oi.number_of_items) AS total_amount
             FROM orders o
             JOIN customers c ON o.customer_id = c.customer_id
             JOIN order_items oi ON o.order_id = oi.order_id
             JOIN flowers f ON oi.flower_id = f.flower_id
             GROUP BY o.order_id
             ORDER BY o.order_date DESC`
        ),

    calculateOrderTotal: (orderId) =>
        db.query(
            `SELECT SUM(f.price * oi.number_of_items) AS total
             FROM order_items oi
             JOIN flowers f ON oi.flower_id = f.flower_id
             WHERE oi.order_id = ?`,
            [orderId]
        ),

    clearOrderItems: (order_id) =>
        db.query("DELETE FROM order_items WHERE order_id = ?", [order_id]),

    deleteOrder: (orderId) =>
        db.query("DELETE FROM orders WHERE order_id = ?", [orderId]),


}