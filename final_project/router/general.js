// Import required modules
const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const public_users = express.Router();

// Task 10: Get the book list available in the shop using async/await
public_users.get('/', async (req, res) => {
    try {
        // Simulate fetching book data with a Promise
        const getBooks = () => Promise.resolve(books);
        const bookList = await getBooks();
        return res.status(200).json(bookList);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book list", error });
    }
});













// Task 11: Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const { isbn } = req.params;
        const getBookByISBN = (isbn) =>
            new Promise((resolve, reject) => {
                if (books[isbn]) {
                    resolve(books[isbn]);
                } else {
                    reject("Book not found");
                }
            });

        const bookDetails = await getBookByISBN(isbn);
        return res.status(200).json(bookDetails);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});




// Task 12: Get book details based on Author using async/await
public_users.get('/author/:author', async (req, res) => {
    try {
        const { author } = req.params;
        const getBooksByAuthor = (author) =>
            new Promise((resolve, reject) => {
                const results = Object.values(books).filter(
                    (book) => book.author === author
                );

                if (results.length > 0) {
                    resolve(results);
                } else {
                    reject("No books found by this author");
                }
            });

        const booksByAuthor = await getBooksByAuthor(author);
        return res.status(200).json(booksByAuthor);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});



// Task 13: Get book details based on Title using async/await
public_users.get('/title/:title', async (req, res) => {
    try {
        const { title } = req.params;
        const getBooksByTitle = (title) =>
            new Promise((resolve, reject) => {
                const results = Object.values(books).filter(
                    (book) => book.title.toLowerCase() === title.toLowerCase()
                );

                if (results.length > 0) {
                    resolve(results);
                } else {
                    reject("No books found with this title");
                }
            });

        const booksByTitle = await getBooksByTitle(title);
        return res.status(200).json(booksByTitle);
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});





// Get book reviews based on ISBN (already implemented synchronously)
public_users.get('/review/:isbn', (req, res) => {
    const { isbn } = req.params;
    if (books[isbn] && books[isbn].reviews) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "No reviews found for this book" });
    }
});

module.exports.general = public_users;
