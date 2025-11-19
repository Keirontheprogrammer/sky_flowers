// controllers/orderController.js
const Customer = require('../models/customerModel');
const Order = require('../models/orderModel');

module.exports = {
    
    createOrder: async (req, res) => {
        const { name, phone_number, items } = req.body; 

        if (!name || !phone_number || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: "Name, phone, and items are required" });
        }

        try {
            
            const [existing] = await Customer.getCustomerByPhone(phone_number);
            let customerId;

            if (existing.length > 0) {
                customerId = existing[0].customer_id;
            } else {
                const [result] = await Customer.createCustomer(name, phone_number);
                customerId = result.insertId;
            }

            
            const [orderResult] = await Order.createOrder(customerId);
            const orderId = orderResult.insertId;

            
            for (const item of items) {
                const qty = item.quantity || 1;
                await Order.addOrderItem(orderId, item.flowerId, qty);
            }

            
            const [[{ total = 0 }]] = await Order.calculateOrderTotal(orderId);

            res.status(201).json({
                message: "Order placed successfully! We'll call you soon.",
                orderId,
                total,
                customerId
            });
        } catch (err) {
            console.error("Checkout error:", err);
            res.status(500).json({ error: "Failed to place order" });
        }
    },

    
    getOrderById: async (req, res) => {
        try {
            const { id } = req.params;
            const [rows] = await Order.getOrderById(id);

            if (rows.length === 0) {
                return res.status(404).json({ error: "Order not found" });
            }

            const order = {
                order_id: rows[0].order_id,
                order_date: rows[0].order_date,
                customer_name: rows[0].customer_name,
                phone_number: rows[0].phone_number,
                items: rows.map(r => ({
                    flower_name: r.flower_name,
                    price: r.price,
                    colors: r.colors,
                    quantity: r.number_of_items,
                    line_total: Number(r.line_total)
                })),
                total_amount: rows.reduce((sum, r) => sum + Number(r.line_total), 0)
            };

            res.json(order);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    
    getAllOrders: async (req, res) => {
        try {
            const [orders] = await Order.getAllOrders();
            res.json(orders);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};