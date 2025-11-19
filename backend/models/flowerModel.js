// models/flowerModel.js
const db = require('../config/db');

module.exports = {
    getAllFlowers: () => db.query("SELECT * FROM flowers"),

    getFlowerById: (id) => db.query("SELECT * FROM flowers WHERE flower_id = ?", [id]),

    getFlowerImages: (id) => db.query("SELECT * FROM flower_images WHERE flower_id = ?", [id]),

    createFlower: (name, price, colors, is_available = true) =>
        db.query(
            "INSERT INTO flowers (name, price, colors, is_available, date_added) VALUES (?, ?, ?, ?, NOW())",
            [name, price, colors, is_available]
        ),

    updateFlower: (id, { name, price, colors, is_available }) =>
        db.query(
            "UPDATE flowers SET name = ?, price = ?, colors = ?, is_available = ? WHERE flower_id = ?",
            [name, price, colors, is_available ?? null, id]
        ),

    toggleAvailability: (id, is_available) =>
        db.query(
            "UPDATE flowers SET is_available = ? WHERE flower_id = ?",
            [is_available, id]
        ),

    deleteFlower: (id) =>
        db.query("DELETE FROM flowers WHERE flower_id = ?", [id]),

    addFlowerImage: (flowerId, imageUrl) =>
        db.query(
            "INSERT INTO flower_images (flower_id, image_url) VALUES (?, ?)",
            [flowerId, imageUrl]
        )
};