
const booksData = require("../db/books-test-collection.json")
const express = require('express');
const books = express.Router();

books.get('/', (req, res) => {
    res.json(booksData);
});

module.exports = books;
