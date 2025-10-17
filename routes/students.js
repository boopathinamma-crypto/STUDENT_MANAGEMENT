
const express = require('express');
const router = express.Router();
const Student = require('D:\\NM_NEW\\routes\\grades.js');

// Get all students
router.get('/', async (req, res) => {
    try {
        const { class: studentClass, active } = req.query;
        const query = {};
        if (studentClass) query.class = studentClass;
        if (active) query.active = active === 'true';
        
        const students = await Student.find(query).sort({ lastName: 1 });
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single student
router.get('/:id', getStudent, (req, res) => {
    res.json(res.student);
});

// Create student
router.post('/', async (req, res) => {
    const student = new Student({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        class: req.body.class,
        subjects: req.body.subjects,
        contactInfo: req.body.contactInfo
    });

    try {
        const newStudent = await student.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update student
router.patch('/:id', getStudent, async (req, res) => {
    if (req.body.firstName != null) res.student.firstName = req.body.firstName;
    if (req.body.lastName != null) res.student.lastName = req.body.lastName;
    if (req.body.email != null) res.student.email = req.body.email;
    if (req.body.class != null) res.student.class = req.body.class;
    if (req.body.subjects != null) res.student.subjects = req.body.subjects;
    if (req.body.contactInfo != null) res.student.contactInfo = req.body.contactInfo;
    if (req.body.active != null) res.student.active = req.body.active;

    try {
        const updatedStudent = await res.student.save();
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get student grades
router.get('/:id/grades', async (req, res) => {
    try {
        const grades = await Grade.find({ student: req.params.id })
            .populate('student', 'firstName lastName')
            .sort({ date: -1 });
        res.json(grades);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to get student by ID
async function getStudent(req, res, next) {
    let student;
    try {
        student = await Student.findById(req.params.id);
        if (student == null) {
            return res.status(404).json({ message: 'Cannot find student' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.student = student;
    next();
}

module.exports = router;
