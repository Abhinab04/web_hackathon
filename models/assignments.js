const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    AssignmentTitle: {
        type: String,
        required: true,
    },
    DeadLine: {
        type: Date,
        required: true,
    }

});

module.exports = mongoose.model('Assignment', AssignmentSchema);
