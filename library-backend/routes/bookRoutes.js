const express = require('express');
const {
    getAllBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook,
    searchBooks
} = require('../controllers/bookController');

const router = express.Router();

router.get('/search', searchBooks);

router
    .route('/')
    .get(getAllBooks)
    .post(addBook);

router
    .route('/:id')
    .get(getBookById)
    .put(updateBook)
    .delete(deleteBook);

module.exports = router;
