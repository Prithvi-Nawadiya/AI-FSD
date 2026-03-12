# Library Management System API

This is a RESTful backend API for a Library Management System built with Node.js, Express, and MongoDB.

## Features
- Add new books
- View all books
- View a single book by ID
- Update book details
- Delete books
- Search books by title

## Local Setup

### 1. Prerequisites
- Node.js installed
- MongoDB installed (or a MongoDB Atlas connection string)

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root of the project with the following (already provided for local setup):
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/library-management
```
*(If you are deploying to Render, you will use your clear MongoDB Atlas string instead).*

### 4. Run the Server
```bash
npm run dev
# OR
node server.js
```

---

## Deployment Instructions

### Part 1: GitHub Deployment
1. Go to your GitHub account and create a **New Repository** (e.g., `library-management-api`).
2. Do not add a README, `.gitignore`, or license initially.
3. Open your terminal in the `library management` folder and run the following commands:

```bash
git init
git add .
git commit -m "Initial commit of Library Management backend API"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL # e.g., https://github.com/username/library-management-api.git
git push -u origin main
```

*(Ensure you have a `.gitignore` file that contains `node_modules/` and `.env` before pushing if you want to keep them private, though for assignments it might not matter)*.

### Part 2: Render Deployment
1. Create an account on [Render.com](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select your `library-management-api` repository.
4. Fill in the deployment settings:
    - **Name**: `library-management-api-YOURNAME` (must be unique)
    - **Environment**: `Node`
    - **Build Command**: `npm install`
    - **Start Command**: `node server.js`
5. At the bottom, click on **Advanced** -> **Add Environment Variable** and add:
    - `MONGO_URI` : `<your_mongodb_cluster_uri_here>` (You must use an external MongoDB, such as MongoDB Atlas, since Render can't access your local database)
6. Click **Create Web Service**. Wait for the build and deployment process to finish (it will say "Live" in green).

---

## Submission Links (Copy these to your word document)

**GitHub Repository Link:**
____________________________________________________

**Render Live API Link:**
____________________________________________________
