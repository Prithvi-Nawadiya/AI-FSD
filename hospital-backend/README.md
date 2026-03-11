# Hospital Patient Management Backend API

This is the backend API for a hospital patient management system. It provides a RESTful API to manage patient records, including registration, updates, retrieval, deletion, and search.

## Tech Stack
* **Node.js**: JavaScript runtime environment.
* **Express.js**: Web framework for building the API.
* **MongoDB & Mongoose**: NoSQL database for flexible data storage.
* **Dotenv**: Environment variable management.
* **Cors**: Cross-Origin Resource Sharing.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ```

3. **Run the Server**
   ```bash
   npm start
   ```

## REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/patients` | Register a new patient |
| `GET` | `/patients` | Get all patient records |
| `GET` | `/patients/search?name=xyz&disease=abc` | Search patients by name or disease |
| `GET` | `/patients/:id` | Get patient by MongoDB ID or Custom Patient ID |
| `PUT` | `/patients/:id` | Update patient details |
| `DELETE` | `/patients/:id` | Delete patient record |

## Deployment to Render

1. Push your code to a GitHub repository.
2. Sign up on [Render.com](https://render.com) and create a new **Web Service**.
3. Connect your GitHub account and select your repository.
4. Render will auto-detect Node.js. Use `npm start` for the Start Command and `npm install` for the Build Command.
5. In the "Environment" section on Render, add your `MONGO_URI` variable.
6. Click **Create Web Service**.

## Student Submission Information

Add your live links into the corresponding fields in your final word document submission. Check the `DEPLOYMENT_LINKS.txt` template to organize your URLs!
