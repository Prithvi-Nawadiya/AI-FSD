const express = require('express');
const {
    createPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    searchPatients
} = require('../controllers/patientController');

const router = express.Router();

// Search route must be defined before /:id to avoid 'search' being treated as an id
router.get('/search', searchPatients);

router.route('/')
    .post(createPatient)
    .get(getAllPatients);

router.route('/:id')
    .get(getPatientById)
    .put(updatePatient)
    .delete(deletePatient);

module.exports = router;
