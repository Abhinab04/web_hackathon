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
    startDate: {
        type: Date,
        require: true
    }

});

module.exports = mongoose.model('Course', CoursesSchema);
