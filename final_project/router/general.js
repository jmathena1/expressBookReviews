const express = require('express');
const _ = require('lodash')
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
    let getAllBooks = new Promise((resolve, reject) => {
        if (books) {
            resolve(res.status(300).json({ books }));
        } else {
            reject(res.status(400).send("Book list not found"))
        }
    })
    getAllBooks.catch(error => {
        console.error(`Error getting all books: ${error}`);
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const filteredBook = Object.values(books).filter(book => book.isbn == req.params.isbn)
    let getBooksByISBN = new Promise((resolve, reject) => {
        if (filteredBook.length == 0 || filteredBook === undefined) {
            reject(res.status(400).send(`Book ${req.params.isbn} not found`))
        } else {
            resolve(res.status(300).json({ filteredBook }));
        }
    })
    getBooksByISBN.catch(error => {
        console.error(`Error searching by ISBN: ${error}`);
    })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const filteredBook = Object.values(books).filter(book => book.author == req.params.author)
    let getBooksByAuthor = new Promise((resolve, reject) => {
        if (filteredBook.length == 0 || filteredBook === undefined) {
            reject(res.status(400).send(`Books by ${req.params.author} not found`))
        } else {
            resolve(res.status(300).json({ filteredBook }));
        }
    })
    getBooksByAuthor.catch(error => {
        console.error(`Error searching by author: ${error}`);
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const filteredBook = Object.values(books).filter(book => book.title == req.params.title)
    let getBooksByTitle = new Promise((resolve, reject) => {
        if (filteredBook.length == 0 || filteredBook === undefined) {
            reject(res.status(400).send(`${req.params.title} not found`))
        } else {
            resolve(res.status(300).json({ filteredBook }));
        }
    })
    getBooksByTitle.catch(error => {
        console.error(`Error searching by title: ${error}`);
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const filteredBookReviews = Object.values(books)
    .filter(book => book.isbn == req.params.isbn)
    .map(book => book.reviews)
    return res.status(300).json({reviews: filteredBookReviews});
});

module.exports.general = public_users;
