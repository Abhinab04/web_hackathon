const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    Announcements: {
        type: String,
        required: true,
    },

});

module.exports = mongoose.model('Notification', NotificationSchema);
