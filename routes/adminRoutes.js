const express = require('express');
const session = require('express-session');
const courses = require('../models/courses');
const user = require('../models/user');
const notification = require('../models/notificaton');

const router = express.Router();

const requireLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/');
    }
    next();
};

router.get('/admin', requireLogin, async (req, res) => {
    const course = await courses.find();
    res.json({
        success: true,
        message: 'admin login sucessful',
        courses: course
    })
});

router.get('/createCourse', requireLogin, async (req, res) => {
    res.json({
        success: true,
        message: 'create course here'
    })
});

router.post('/createCourse', requireLogin, async (req, res) => {
    try {
        console.log('Inside signup route');

        const { courseName, description, price } = req.body;

        if (!courseName || !description || !price) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the credentials"
            });
        }
        const exist = await courses.findOne({ courseName: courseName });

        if (exist) {
            return res.status(409).json({
                success: false,
                message: 'This course is already present.'
            });
        }
        const newCourse = await user.create({
            courseName,
            description,
            price,
        });

    } catch (error) {
        console.log(error);
    }
});

router.get('/allStudent', async (req, res) => {
    try {
        page = parseInt(page) || 1;
        limit = 10;

        const skip = (page - 1) * limit;

        const students = await user.find({ role: 'student' })
            .skip(skip)
            .limit(limit);

        const totalStudents = await user.countDocuments({ role: 'student' });

        res.json({
            success: true,
            page,
            totalPages: Math.ceil(totalStudents / limit),
            totalStudents,
            students
        });

    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
});

router.get('/allFaculty', async (req, res) => {
    try {
        page = parseInt(page) || 1;
        limit = 10;

        const skip = (page - 1) * limit;

        const students = await user.find({ role: 'faculty' })
            .skip(skip)
            .limit(limit);

        const totalFaculty = await user.countDocuments({ role: 'faculty' });

        res.json({
            success: true,
            page,
            totalPages: Math.ceil(totalFaculty / limit),
            totalStudents,
            students
        });

    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
});

router.post('/editBatch', async (req, res) => {
    const { oldcourseName, newcourseName, description, price } = req.body;
    const exist = await courses.findOne({ courseName: oldcourseName });
    const updatedCourse = await user.findByIdAndUpdate(exist._id, {
        courseName: newcourseName,
        description: description,
        price: price,
    },
        { new: true }
    );

});

router.post('/notification', async (req, res) => {
    const { Uploadednotification } = req.body;
    const newNotification = await notification.create({
        Uploadednotification,
    });
})


module.exports = router;