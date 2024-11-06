const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: `${username} successfully registered. Now you can login`});
        } else {
            return res.status(404).json({message: `${username} already exists!`});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(300).json({ books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const filteredBook = Object.values(books).filter(book => book.isbn == req.params.isbn)
    return res.status(300).json({books: filteredBook});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const filteredBook = Object.values(books).filter(book => book.author == req.params.author)
    return res.status(300).json({books: filteredBook});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const filteredBook = Object.values(books).filter(book => book.title == req.params.title)
    return res.status(300).json({books: filteredBook});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const filteredBookReviews = Object.values(books)
    .filter(book => book.isbn == req.params.isbn)
    .map(book => book.reviews)
    return res.status(300).json({reviews: filteredBookReviews});
});

module.exports.general = public_users;
