const db = require('../config/db');

module.exports = {
    getAllFlowers: () => db.query("SELECT * FROM flowers"),

    getFlowersById: (id)=> db.query("SELECT * FROM flowers WHERE flower_id = ?", [id]),

    getFlowerImages: (id)=> db.query("SELECT * FROM flower_images WHERE flower_id = ?", [id]),

    createFlower: (name, price, color, description, is_available = true)=>db.query(
        "INSERT INTO flowers (name, price, color, description, is_available, date_added) VALUES(?,?,?,?,?, NOW())", 
        [name, price, color, description, is_available]
    ),
    
    deleteFLower: (id)=> db.query("DELETE FROM flowers WHERE flower_id = ?",[id]),

    addflowerImage: (flowerId, imageUrl)=> db.query(
        "INSERT INTO flower_images (flower_id, image_url) VALUES (?,?)",
        [flowerId, imageUrl]
    ),

    toggleAvilability:(id, is_available)=>db.query("UPDATE flower SET is_available = ? WHERE flower_id = ?",[is_available,id]),

    updateFlower: (id, { name, price, colors, is_available }) =>
        db.query(
            "UPDATE flowers SET name = ?, price = ?, colors = ?, is_available = ? WHERE flower_id = ?",
            [name, price, colors, is_available, id]
        ),
};

