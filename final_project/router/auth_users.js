// Import required modules
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

// In-memory storage for users
let users = [];

// Function to check if a username is valid
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Function to authenticate a user by username and password
const authenticatedUser = (username, password) => {
    const user = users.find(user => user.username === username && user.password === password);
    return user !== undefined;
};

// Login route for registered users
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });
        req.session.token = token;
        return res.status(200).json({ message: "Login successful", token });
    } else {
        return res.status(401).json({ message: "Invalid credentials" });
    }
});

/// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    const username = jwt.verify(req.session.token, "secret_key").username;
    
    // Check if the user is the one who posted the review
    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username]; // Delete the review
        return res.status(200).json({ message: "Review deleted", reviews: books[isbn].reviews });
    } else {
        return res.status(403).json({ message: "You can only delete your own reviews" });
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
