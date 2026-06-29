
const errorMiddleware = require("./middleware/error.middleware");
require("dotenv").config({ quiet: true });
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();

const authRoutes = require("./routes/auth.routes")
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");


// Core Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());

// Logging 
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// Health Check Route
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", message: "Server is running" });
});

const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//  Global Error Handler (MUST BE LAST)
app.use(errorMiddleware);

module.exports = app;