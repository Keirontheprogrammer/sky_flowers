// server.js
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

// Import routes
const flowerRoutes = require('./routes/flowers');
const customerRoutes = require('./routes/customers');
const orderRoutes = require('./routes/orders');
// const paymentRoutes = require('./routes/payments'); // for later

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
async function testDB() {
    try {
        const [rows] = await db.query("SELECT 1 + 1 AS result");
        console.log("MySQL Connected Successfully! → 1 + 1 =", rows[0].result);
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1); // Stop server if DB is down
    }
}
testDB();

// API Routes
app.use("/api/flowers", flowerRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
// app.use("/api/payments", paymentRoutes); // later

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "Flower Shop API is running!" });
});


app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Flower Shop API (MySQL + Express)" });
});

// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`→ Shop: http://localhost:${PORT}/api/flowers`);
    console.log(`→ Checkout: POST http://localhost:${PORT}/api/orders`);
});