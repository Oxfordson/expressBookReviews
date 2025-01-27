// Import required modules
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Set up session for customer routes
app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Middleware for authentication
app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.session.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized access" });
    }
    try {
        jwt.verify(token, "secret_key"); // Verify the token
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
});

// Route configurations
const PORT = 5000;

app.use("/customer", customer_routes); // Customer-specific routes
app.use("/", genl_routes); // General routes

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
