
const express = require('express');
const router = express.Router();
const Grade = require('D:\\NM_NEW\\models\\grades.js');
const Student = require('D:\\NM_NEW\\models\\Student.js');

// Get all grades with filters
router.get('/', async (req, res) => {
    try {
        const { student, class: className, subject, semester } = req.query;
        const query = {};
        if (student) query.student = student;
        if (className) query.class = className;
        if (subject) query.subject = subject;
        if (semester) query.semester = semester;

        const grades = await Grade.find(query)
            .populate('student', 'firstName lastName')
            .sort({ date: -1 });
        res.json(grades);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add new grade
router.post('/', async (req, res) => {
    const grade = new Grade({
        student: req.body.studentId,
        subject: req.body.subject,
        assessmentType: req.body.assessmentType,
        score: req.body.score,
        maxScore: req.body.maxScore || 100,
        class: req.body.class,
        teacher: req.body.teacher,
        comments: req.body.comments,
        semester: req.body.semester
    });

    try {
        const newGrade = await grade.save();
        res.status(201).json(newGrade);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get grade statistics
router.get('/stats', async (req, res) => {
    try {
        const { class: className, subject, semester } = req.query;
        const match = {};
        if (className) match.class = className;
        if (subject) match.subject = subject;
        if (semester) match.semester = semester;

        const stats = await Grade.aggregate([
            { $match: match },
            { 
                $group: {
                    _id: null,
                    average: { $avg: "$score" },
                    min: { $min: "$score" },
                    max: { $max: "$score" },
                    count: { $sum: 1 }
                }
            }
        ]);

        const gradeDistribution = await Grade.aggregate([
            { $match: match },
            { 
                $bucket: {
                    groupBy: "$score",
                    boundaries: [0, 60, 70, 80, 90, 101],
                    default: "other",
                    output: {
                        count: { $sum: 1 },
                        avgScore: { $avg: "$score" }
                    }
                }
            }
        ]);

        res.json({
            stats: stats[0] || {},
            gradeDistribution
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;