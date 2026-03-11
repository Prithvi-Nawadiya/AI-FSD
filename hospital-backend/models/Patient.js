const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    patientId: {
        type: String,
        unique: true,
        default: () => 'PAT-' + Math.floor(1000 + Math.random() * 9000)
    },
    fullName: {
        type: String,
        required: [true, 'Full name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required']
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [1, 'Age must be a positive number']
    },
    gender: {
        type: String
    },
    disease: {
        type: String,
        required: [true, 'Disease/Diagnosis is required']
    },
    doctorAssigned: {
        type: String,
        required: [true, 'Assigned doctor is required']
    },
    admissionDate: {
        type: Date,
        default: Date.now
    },
    roomNumber: {
        type: String
    },
    patientType: {
        type: String,
        enum: ['Inpatient', 'Outpatient']
    },
    status: {
        type: String,
        enum: ['Admitted', 'Discharged'],
        default: 'Admitted'
    }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
