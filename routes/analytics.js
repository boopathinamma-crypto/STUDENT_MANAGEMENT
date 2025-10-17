
const express = require('express');
const router = express.Router();
const Grade = require('../models/Grade');
const Student = require('../models/Student');

// Get performance trends
router.get('/trends', async (req, res) => {
    try {
        const { class: className, subject } = req.query;
        const match = {};
        if (className) match.class = className;
        if (subject) match.subject = subject;

        const trends = await Grade.aggregate([
            { $match: match },
            {
                $group: {
                    _id: { 
                        year: { $year: "$date" },
                        month: { $month: "$date" }
                    },
                    averageScore: { $avg: "$score" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            { $limit: 6 }
        ]);

        res.json(trends);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get class comparison
router.get('/class-comparison', async (req, res) => {
    try {
        const { subject, semester } = req.query;
        const match = {};
        if (subject) match.subject = subject;
        if (semester) match.semester = semester;

        const comparison = await Grade.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$class",
                    averageScore: { $avg: "$score" }
                }
            },
            { $sort: { averageScore: -1 } }
        ]);

        res.json(comparison);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get top performers
router.get('/top-performers', async (req, res) => {
    try {
        const { limit = 10, class: className, semester } = req.query;
        const match = {};
        if (className) match.class = className;
        if (semester) match.semester = semester;

        const topPerformers = await Grade.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$student",
                    averageScore: { $avg: "$score" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { averageScore: -1 } },
            { $limit: parseInt(limit) },
            {
                $lookup: {
                    from: "students",
                    localField: "_id",
                    foreignField: "_id",
                    as: "student"
                }
            },
            { $unwind: "$student" },
            {
                $project: {
                    _id: 0,
                    student: {
                        _id: "$student._id",
                        firstName: "$student.firstName",
                        lastName: "$student.lastName",
                        email: "$student.email",
                        class: "$student.class"
                    },
                    averageScore: 1,
                    count: 1
                }
            }
        ]);

        res.json(topPerformers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
