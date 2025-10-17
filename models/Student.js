
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    class: { type: String, required: true },
    subjects: [{
        name: String,
        teacher: String,
        credits: Number
    }],
    admissionDate: { type: Date, default: Date.now },
    contactInfo: {
        phone: String,
        address: String,
        parentName: String,
        parentPhone: String
    },
    photo: String,
    active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
