const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const customerRoutes = require('./routes/customers');
const flowerRoutes = require('./routes/flowers');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
async function testDB(){
try {
//  const [rows] = await db.query("SELECT 1 + 1 AS result");
  console.log(" MySQL Connected: Result =", rows[0].result);
} catch (error) {
  console.error(" Database connection failed:", error.message);
}
}
testDB();

// API routes
app.use("/api/flowers", flowerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/payments", paymentRoutes);

// Default route
app.get("/", (req, res) => {
  res.send(" Welcome to the Flower Shop API (MySQL version)!");
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
