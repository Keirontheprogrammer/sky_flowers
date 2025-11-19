// controllers/flowerController.js
const Flower = require('../models/flowerModel');

module.exports = {
    getAllFlowers: async (req, res) => {
        try {
            const [flowers] = await Flower.getAllFlowers();
            res.json(flowers);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    getFlowerById: async (req, res) => {  
        try {
            const { id } = req.params;
            const [flowers] = await Flower.getFlowerById(id);  
            if (!flowers || flowers.length === 0) {  
                return res.status(404).json({ error: "Flower not found" });
            }
            const [images] = await Flower.getFlowerImages(id);
            res.json({
                ...flowers[0],  
                images: images.map(i => i.image_url)
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    createFlower: async (req, res) => {
        try {
            const { name, price, colors, is_available = true } = req.body;

            if (!name || !price || !colors) {
                return res.status(400).json({ error: "Name, price, and colors are required" });
            }
            if (typeof price !== 'number' || price <= 0) {
                return res.status(400).json({ error: "Price must be a positive number" });
            }

            const [result] = await Flower.createFlower(name, price, colors, is_available);
            res.status(201).json({
                message: "Flower created successfully",
                flower_id: result.insertId
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    addFlowerImage: async (req, res) => {
        try {
            const { id: flowerId } = req.params;
            const { imageUrl } = req.body;  

            if (!imageUrl) {  
                return res.status(400).json({ error: "Image URL is required" });
            }
            const [flower] = await Flower.getFlowerById(flowerId);  
            if (!flower || flower.length === 0) {
                return res.status(404).json({ error: "Flower not found" });
            }

            await Flower.addFlowerImage(flowerId, imageUrl);
            res.status(201).json({ message: "Image added successfully" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    updateFlower: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, price, colors, is_available } = req.body;

            const [flower] = await Flower.getFlowerById(id);  
            if (!flower || flower.length === 0) {
                return res.status(404).json({ error: "Flower not found" });
            }

            if (!name && !price && !colors && is_available === undefined) {
                return res.status(400).json({ error: "At least one field is required to update" });
            }
            if (price && (typeof price !== 'number' || price <= 0)) {
                return res.status(400).json({ error: "Price must be a positive number" });
            }

            const flowerData = {
                name: name || flower[0].name,
                price: price || flower[0].price,
                colors: colors || flower[0].colors,
                is_available: is_available !== undefined ? is_available : flower[0].is_available
            };

            await Flower.updateFlower(id, flowerData);
            const [updatedFlower] = await Flower.getFlowerById(id);
            res.json({
                message: "Flower updated successfully",
                flower: updatedFlower[0]
            });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    deleteFlower: async (req, res) => {
        try {
            const { id } = req.params;

            const [flower] = await Flower.getFlowerById(id);
            if (!flower || flower.length === 0) {
                return res.status(404).json({ error: "Flower not found" });
            }

            await Flower.deleteFlower(id);
            res.json({ message: "Flower deleted successfully" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};