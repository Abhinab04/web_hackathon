const mongoose = require('mongoose');

const CoursesSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    content: [{
        type: { type: String, enum: ['lecture', 'pdf', 'video'], required: true },
        title: { type: String, required: true },
        url: { type: String, required: true },
        path: { type: String }
    }],

});

module.exports = mongoose.model('Course', CoursesSchema);
