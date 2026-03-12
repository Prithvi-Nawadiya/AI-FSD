# Hospital Patient Management System - Final Project Submission

## 1. Project Overview & Deployment
**Project Name:** TheMedico (Hospital Patient Management System)
**Tech Stack:** Node.js, Express.js, MongoDB, HTML, CSS, JavaScript

### Live Deployment Links
- **Backend API (Render):** https://themedico.onrender.com
- **Frontend UI (GitHub Pages):** https://Prithvi-Nawadiya.github.io/AI-FSD/hospital-frontend/ 
- **GitHub Source Code:** https://github.com/Prithvi-Nawadiya/AI-FSD

---

## 2. MongoDB Data Storage Implementation
The system uses MongoDB (Atlas) to store patient records. Below is the Mongoose Schema definition defining the database structure, followed by an example of how a record is stored in the database.

### MongoDB Schema (`models/Patient.js`)
```javascript
const patientSchema = new mongoose.Schema({
    patientId: { type: String, unique: true, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    disease: { type: String, required: true },
    doctorAssigned: { type: String, required: true },
    admissionDate: { type: Date, default: Date.now },
    roomNumber: { type: String, required: true },
    patientType: { type: String, enum: ['Inpatient', 'Outpatient'], required: true },
    status: { type: String, enum: ['Admitted', 'Discharged'], default: 'Admitted' }
});
```

### Example Stored Document (MongoDB JSON Output)
```json
{
  "_id": { "$oid": "651a2b3c4d5e6f7a8b9c0d1e" },
  "patientId": "PAT-4829",
  "fullName": "John Doe",
  "email": "johndoe@example.com",
  "phoneNumber": "9876543210",
  "age": 45,
  "gender": "Male",
  "disease": "Viral Fever",
  "doctorAssigned": "Dr. Smith",
  "roomNumber": "104-B",
  "patientType": "Inpatient",
  "status": "Admitted",
  "admissionDate": { "$date": "2026-03-11T10:00:00Z" },
  "__v": 0
}
```

---

## 3. Postman REST API Requests & HTTP Output
The backend REST API handles all CRUD operations. Below are the HTTP requests and their corresponding Input/Output payloads.

### A. Register New Patient (POST)
- **Endpoint:** `POST /patients`
- **Description:** Adds a new patient to the MongoDB database.
- **Request Body (JSON Input):**
```json
{
    "fullName": "Sarah Connor",
    "email": "sarah@example.com",
    "phoneNumber": "9998887770",
    "age": 30,
    "gender": "Female",
    "disease": "Migraine",
    "doctorAssigned": "Dr. Adams",
    "roomNumber": "201-A",
    "patientType": "Outpatient"
}
```
- **Response Output (201 Created):**
```json
{
    "success": true,
    "data": {
        "patientId": "PAT-7391",
        "fullName": "Sarah Connor",
        "status": "Admitted",
        "_id": "651a2b3c4d5e6f7a8b9c0d1f"
    }
}
```

### B. View All Patients (GET)
- **Endpoint:** `GET /patients`
- **Description:** Retrieves a list of all patient records from the database.
- **Response Output (200 OK):**
```json
{
    "success": true,
    "count": 1,
    "data": [
        {
            "patientId": "PAT-7391",
            "fullName": "Sarah Connor",
            "disease": "Migraine",
            "status": "Admitted"
        }
    ]
}
```

### C. Search Patients by Name or Disease (GET)
- **Endpoint:** `GET /patients/search?name=Sarah`
- **Description:** Case-insensitive search using MongoDB regex `$or` operator.
- **Response Output (200 OK):**
```json
{
    "success": true,
    "count": 1,
    "data": [
        {
            "patientId": "PAT-7391",
            "fullName": "Sarah Connor",
            "disease": "Migraine"
        }
    ]
}
```

### D. Update Patient Details (PUT)
- **Endpoint:** `PUT /patients/651a2b3c4d5e6f7a8b9c0d1f`
- **Description:** Updates specific fields of an existing patient (e.g., discharging them).
- **Request Body:**
```json
{
    "status": "Discharged"
}
```
- **Response Output (200 OK):**
```json
{
    "success": true,
    "data": {
        "fullName": "Sarah Connor",
        "status": "Discharged"
    }
}
```

### E. Delete Patient Record (DELETE)
- **Endpoint:** `DELETE /patients/651a2b3c4d5e6f7a8b9c0d1f`
- **Description:** Completely removes a patient record from MongoDB.
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
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

app.use('/patients', require('./routes/patientRoutes'));
app.use(require('./middleware/error'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### Backend: `controllers/patientController.js` (Core Logic)
```javascript
const Patient = require('../models/Patient');

exports.createPatient = async (req, res, next) => {
    try {
        const patient = await Patient.create(req.body);
        res.status(201).json({ success: true, data: patient });
    } catch (err) { next(err); }
};

exports.getAllPatients = async (req, res, next) => {
    try {
        const patients = await Patient.find();
        res.status(200).json({ success: true, count: patients.length, data: patients });
    } catch (err) { next(err); }
};

exports.searchPatients = async (req, res, next) => {
    try {
        const { name, disease } = req.query;
        let orConditions = [];
        if (name) orConditions.push({ fullName: { $regex: name, $options: 'i' } });
        if (disease) orConditions.push({ disease: { $regex: disease, $options: 'i' } });
        
        const patients = await Patient.find({ $or: orConditions });
        res.status(200).json({ success: true, count: patients.length, data: patients });
    } catch (err) { next(err); }
};
```

### Frontend: `api.js` (Frontend API Connection)
```javascript
const API_BASE_URL = 'https://themedico.onrender.com/patients';

async function handleResponse(response) {
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'API Request Failed');
    return data;
}

const hospitalAPI = {
    getAllPatients: async () => handleResponse(await fetch(API_BASE_URL)),
    registerPatient: async (patientData) => handleResponse(
        await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patientData)
        })
    )
};
```

---

## 5. UI Code Output & Usage Flow
1. **Registration:** The user visits `register.html`, fills out the form including Age, Disease, Doctor, and Room Number, and clicks "Register". The frontend calls `hospitalAPI.registerPatient()`.
2. **Success Feedback:** A green alert notification pops up showing "Patient Registered Successfully" and the page dynamically redirects to the Dashboard.
3. **Dashboard View:** `index.html` calls `hospitalAPI.getAllPatients()`. A modern, styled HTML table dynamically populates with the patients pulled live from the Render API & MongoDB Atlas database.
4. **Search Functionality:** Typing "Migraine" into the search bar dynamically filters the Render API to only return and display patients diagnosed with Migraine.
