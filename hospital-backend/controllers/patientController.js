const Patient = require('../models/Patient');

// @desc    Register a new patient
// @route   POST /patients
exports.createPatient = async (req, res, next) => {
    try {
        const patient = await Patient.create(req.body);
        res.status(201).json({
            success: true,
            data: patient
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all patient records
// @route   GET /patients
exports.getAllPatients = async (req, res, next) => {
    try {
        const patients = await Patient.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: patients.length,
            data: patients
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Search patients by name or disease
// @route   GET /patients/search
exports.searchPatients = async (req, res, next) => {
    try {
        const { name, disease } = req.query;

        let orConditions = [];
        if (name) {
            orConditions.push({ fullName: { $regex: name, $options: 'i' } });
        }
        if (disease) {
            orConditions.push({ disease: { $regex: disease, $options: 'i' } });
        }

        // If no query parameters are provided, return bad request
        if (orConditions.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Please provide name or disease query parameter'
            });
        }

        const query = { $or: orConditions };
        const patients = await Patient.find(query);
        res.status(200).json({
            success: true,
            count: patients.length,
            data: patients
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get patient by ID
// @route   GET /patients/:id
exports.getPatientById = async (req, res, next) => {
    try {
        // Find by MongoDB _id or custom patientId
        const patient = await Patient.findOne({
            $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { patientId: req.params.id }]
        });

        if (!patient) {
            return res.status(404).json({
                success: false,
                error: 'Patient not found'
            });
        }

        res.status(200).json({
            success: true,
            data: patient
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update patient details
// @route   PUT /patients/:id
exports.updatePatient = async (req, res, next) => {
    try {
        let patient = await Patient.findOne({
            $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { patientId: req.params.id }]
        });

        if (!patient) {
            return res.status(404).json({
                success: false,
                error: 'Patient not found'
            });
        }

        patient = await Patient.findByIdAndUpdate(patient._id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: patient
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete patient record
// @route   DELETE /patients/:id
exports.deletePatient = async (req, res, next) => {
    try {
        const patient = await Patient.findOne({
            $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { patientId: req.params.id }]
        });

        if (!patient) {
            return res.status(404).json({
                success: false,
                error: 'Patient not found'
            });
        }

        await patient.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
