# Library Management System - Final Project Submission

## 1. Project Overview & Deployment
**Project Name:** Library Management System
**Tech Stack:** Node.js, Express.js, MongoDB

### Live Deployment Links
- **Backend API (Render):** `[INSERT YOUR RENDER URL HERE (e.g., https://library-backend.onrender.com)]`
- **GitHub Source Code:** `[INSERT YOUR GITHUB REPO URL HERE (e.g., https://github.com/Prithvi-Nawadiya/AI-FSD)]`

---

## 2. MongoDB Data Storage Implementation
The system uses MongoDB (Atlas/Local) to store book records. Below is the Mongoose Schema definition defining the database structure, followed by an example of how a record is stored in the database.

### MongoDB Schema (`models/Book.js`)
```javascript
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: [true, 'Title is required'] },
    author: { type: String, required: [true, 'Author is required'] },
    isbn: { type: String, required: [true, 'ISBN is required'], unique: true },
    genre: { type: String, required: [true, 'Genre is required'] },
    publisher: { type: String, required: [true, 'Publisher is required'] },
    publicationYear: { type: Number },
    totalCopies: { type: Number, required: [true, 'Total Copies is required'], min: [1, 'Total Copies must be at least 1'] },
    availableCopies: { type: Number },
    shelfLocation: { type: String },
    bookType: { type: String, enum: ['Reference', 'Circulating'], default: 'Circulating' },
    status: { type: String, enum: ['Available', 'Checked Out'], default: 'Available' }
}, { timestamps: true });

bookSchema.pre('save', function (next) {
    if (this.isNew && this.availableCopies === undefined) {
        this.availableCopies = this.totalCopies;
    }
    next();
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
```

### Example Stored Document (MongoDB JSON Output)
```json
{
  "_id": { "$oid": "651b3c4d5e6f7a8b9c0d12ab" },
  "title": "The Power of Habit",
  "author": "Charles Duhigg",
  "isbn": "9780812981605",
  "genre": "Self-Help",
  "publisher": "Random House",
  "publicationYear": 2012,
  "totalCopies": 10,
  "availableCopies": 10,
  "shelfLocation": "A1-Shelf",
  "bookType": "Circulating",
  "status": "Available",
  "createdAt": { "$date": "2026-03-12T10:00:00Z" },
  "updatedAt": { "$date": "2026-03-12T10:00:00Z" },
  "__v": 0
}
```

---

## 3. Postman REST API Requests & HTTP Output
The backend REST API handles all CRUD operations. Below are the HTTP requests and their corresponding Input/Output payloads.

### A. Add New Book (POST)
- **Endpoint:** `POST /books`
- **Description:** Adds a new book to the MongoDB database.
- **Request Body (JSON Input):**
```json
{
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "isbn": "9780132350884",
    "genre": "Technology",
    "publisher": "Prentice Hall",
    "publicationYear": 2008,
    "totalCopies": 5,
    "shelfLocation": "Tech-B2"
}
```
- **Response Output (201 Created):**
```json
{
    "success": true,
    "data": {
        "title": "Clean Code",
        "author": "Robert C. Martin",
        "isbn": "9780132350884",
        "genre": "Technology",
        "publisher": "Prentice Hall",
        "publicationYear": 2008,
        "totalCopies": 5,
        "bookType": "Circulating",
        "status": "Available",
        "_id": "651b3c4d5e6f7a8b9c0d12cd",
        "availableCopies": 5,
        "createdAt": "2026-03-12T10:05:00.000Z",
        "updatedAt": "2026-03-12T10:05:00.000Z",
        "__v": 0
    }
}
```

### B. View All Book Records (GET)
- **Endpoint:** `GET /books`
- **Description:** Retrieves a list of all book records from the database.
- **Response Output (200 OK):**
```json
{
    "success": true,
    "count": 1,
    "data": [
        {
            "_id": "651b3c4d5e6f7a8b9c0d12cd",
            "title": "Clean Code",
            "author": "Robert C. Martin",
            "isbn": "9780132350884",
            "genre": "Technology",
            "publisher": "Prentice Hall",
            "publicationYear": 2008,
            "totalCopies": 5,
            "bookType": "Circulating",
            "status": "Available",
            "availableCopies": 5
        }
    ]
}
```

### C. Search Books by Title (GET)
- **Endpoint:** `GET /books/search?title=Clean`
- **Description:** Case-insensitive search using MongoDB regex.
- **Response Output (200 OK):**
```json
{
    "success": true,
    "count": 1,
    "data": [
        {
            "_id": "651b3c4d5e6f7a8b9c0d12cd",
            "title": "Clean Code",
            "author": "Robert C. Martin",
            "isbn": "9780132350884",
            "genre": "Technology",
            "totalCopies": 5,
            "availableCopies": 5
        }
    ]
}
```

### D. Update Book Details (PUT)
- **Endpoint:** `PUT /books/651b3c4d5e6f7a8b9c0d12cd`
- **Description:** Updates specific fields of an existing book (e.g., changing status or shelf location).
- **Request Body:**
```json
{
    "status": "Checked Out",
    "availableCopies": 4
}
```
- **Response Output (200 OK):**
```json
{
    "success": true,
    "data": {
        "_id": "651b3c4d5e6f7a8b9c0d12cd",
        "title": "Clean Code",
        "status": "Checked Out",
        "availableCopies": 4
    }
}
```

### E. Delete Book Record (DELETE)
- **Endpoint:** `DELETE /books/651b3c4d5e6f7a8b9c0d12cd`
- **Description:** Completely removes a book record from MongoDB.
- **Response Output (200 OK):**
```json
{
    "success": true,
    "data": {}
}
```

---

## 4. Source Code Implementation

### Backend: `server.js` (Express Hub & MongoDB Connection)
```javascript
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars & Connect to DB
dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// API routes
app.use('/books', require('./routes/bookRoutes'));

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));
```

### Backend: `controllers/bookController.js` (Core Logic)
```javascript
const Book = require('../models/Book');

exports.addBook = async (req, res, next) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).json({ success: true, data: book });
    } catch (err) { next(err); }
};

exports.getAllBooks = async (req, res, next) => {
    try {
        const books = await Book.find();
        res.status(200).json({ success: true, count: books.length, data: books });
    } catch (err) { next(err); }
};

exports.searchBooks = async (req, res, next) => {
    try {
        const { title } = req.query;
        if (!title) return res.status(400).json({ success: false, error: 'Please provide a search title in query string field `title`' });
        
        const books = await Book.find({ title: { $regex: title, $options: 'i' } });
        res.status(200).json({ success: true, count: books.length, data: books });
    } catch (err) { next(err); }
};
```
