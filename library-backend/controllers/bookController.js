const Book = require('../models/Book');

// @desc    Get all books
// @route   GET /books
// @access  Public
exports.getAllBooks = async (req, res, next) => {
    try {
        const books = await Book.find();
        res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single book
// @route   GET /books/:id
// @access  Public
exports.getBookById = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ success: false, error: 'Book not found' });
        }

        res.status(200).json({
            success: true,
            data: book
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Add a book
// @route   POST /books
// @access  Public
exports.addBook = async (req, res, next) => {
    try {
        const book = await Book.create(req.body);

        res.status(201).json({
            success: true,
            data: book
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update book
// @route   PUT /books/:id
// @access  Public
exports.updateBook = async (req, res, next) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!book) {
            return res.status(404).json({ success: false, error: 'Book not found' });
        }

        res.status(200).json({
            success: true,
            data: book
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete book
// @route   DELETE /books/:id
// @access  Public
exports.deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).json({ success: false, error: 'Book not found' });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Search books by title
// @route   GET /books/search?title=xyz
// @access  Public
exports.searchBooks = async (req, res, next) => {
    try {
        const { title } = req.query;

        if (!title) {
            return res.status(400).json({ success: false, error: 'Please provide a search title in query string field `title`' });
        }

        const books = await Book.find({ title: { $regex: title, $options: 'i' } });

        res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (err) {
        next(err);
    }
};
