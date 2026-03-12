# Library Management Backend

This is a Node.js + Express + MongoDB backend for a simple Library Management System. It provides REST API endpoints to manage books (create, read, update, delete) and search books by title or author.

## Features implemented

- Add new books
- View all book records
- Update book details
- Delete book records
- Search books by title or author
- Proper status codes and error handling

## Tech

- Node.js
- Express
- MongoDB (Mongoose)
- dotenv

## Quick start (local)

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `PORT`.
2. Install dependencies and start the server from the `hospital-backend` folder:

```bash
npm install
npm start
```

The server listens on `PORT` (default 5000).

## API Endpoints

Base URL: `http://localhost:5000`

- POST /books — Add a new book (201 Created)
- GET /books — Get all book records (200 OK)
- GET /books/:id — Get book by ID (200 OK / 404 Not Found)
- PUT /books/:id — Update book details (200 OK / 404 Not Found)
- DELETE /books/:id — Delete book record (200 OK / 404 Not Found)
- GET /books/search?title=xyz&author=abc — Search books by title or author (400 Bad Request if no query)

Notes:

- `:id` can be the MongoDB `_id` or the auto-generated `bookId` (e.g., BOOK-1234).
- Validation errors return 400. Server errors return 500.

## Deploy to GitHub and Render

1. Push this repository to GitHub (create a new repo and push your branch):

```bash
# from project root
git init
git add .
git commit -m "Add library-backend"
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

2. Deploy to Render (Static/Private Service):

- Create a new Web Service on Render.
- Connect your GitHub repository and select the branch to deploy.
- Set the Build Command: `npm install`
- Set the Start Command: `npm start`
- Add environment variable `MONGO_URI` in the Render dashboard (do NOT commit secrets to the repo).

After successful deploy, Render will provide a public URL — add that and the GitHub repo link to your submission document.

## Validation & Notes

- The Book model enforces required fields and unique ISBN.
- Error handling middleware returns readable errors for validation and duplicate key problems.
