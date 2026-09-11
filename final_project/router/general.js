const axios = require("axios");
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if (isValid(username)) {
    return res.status(409).json({message: "User already exists"});
  }

  users.push({username: username, password: password});

  return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let result = {};

  for (let isbn in books) {
    if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
      result[isbn] = books[isbn];
    }
  }

  return res.status(200).json(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let result = {};

  for (let isbn in books) {
    if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
      result[isbn] = books[isbn];
    }
  }

  return res.status(200).json(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Get all books using Axios and async/await
public_users.get('/axios/books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});

// Get books by author using Axios and async/await
public_users.get('/axios/author/:author', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    const books = response.data;
    const author = req.params.author;
    let result = {};

    for (let isbn in books) {
      if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
        result[isbn] = books[isbn];
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});

// Get books by title using Axios and async/await
public_users.get('/axios/title/:title', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    const books = response.data;
    const title = req.params.title;
    let result = {};

    for (let isbn in books) {
      if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
        result[isbn] = books[isbn];
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});

// Get book by ISBN using Axios and async/await
public_users.get('/axios/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    const books = response.data;
    const isbn = req.params.isbn;

    if (books[isbn]) {
      return res.status(200).json(books[isbn]);
    }

    return res.status(404).json({message: "Book not found"});
  } catch (error) {
    return res.status(500).json({message: "Error retrieving book"});
  }
});

module.exports.general = public_users;
