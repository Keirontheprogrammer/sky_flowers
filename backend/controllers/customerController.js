// controllers/customerController.js
const Customer = require('../models/customerModel');

module.exports = {
    
    findOrCreate: async (req, res) => {
        try {
            const { name, phone_number } = req.body;

            if (!name || !phone_number) {
                return res.status(400).json({ error: "Name and phone are required" });
            }

            const [existing] = await Customer.getCustomerByPhone(phone_number);

            if (existing.length > 0) {
                return res.json(existing[0]); 
            }

            const [result] = await Customer.createCustomer(name, phone_number);
            const [newCustomer] = await Customer.getCustomerById(result.insertId);

            res.status(201).json(newCustomer[0]);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    
    getCustomerOrders: async (req, res) => {
        try {
            const { id } = req.params;
            const [orders] = await Customer.getCustomerOrders(id);
            res.json(orders);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};