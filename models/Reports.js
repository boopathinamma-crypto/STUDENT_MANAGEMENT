
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    class: { type: String, required: true },
    semester: { type: String, required: true },
    grades: [{
        subject: String,
        average: Number,
        assignments: Number,
        tests: Number,
        finalExam: Number
    }],
    overallAverage: { type: Number, required: true },
    comments: String,
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    generatedAt: { type: Date, default: Date.now },
    pdfPath: String,
    isPublished: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
