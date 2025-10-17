
const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subject: { type: String, required: true },
    assessmentType: { type: String, enum: ['Test', 'Quiz', 'Assignment', 'Exam', 'Project'] },
    score: { type: Number, required: true, min: 0, max: 100 },
    maxScore: { type: Number, default: 100 },
    date: { type: Date, default: Date.now },
    class: { type: String, required: true },
    teacher: { type: String, required: true },
    comments: String,
    semester: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Grade', gradeSchema);
