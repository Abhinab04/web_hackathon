const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const courses = require('../models/courses');
const passport = require('passport');
const validator = require('validator');
// require('../passport');
require('dotenv').config();

const router = express.Router();


router.post('/signup', async (req, res) => {
    try {
        console.log('Inside signup route');

        const { userName, email, password, role } = req.body;

        if (!userName || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the credentials"
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(500).json({
                sucess: false,
                message: 'email is not valid please provide valid email'
            })
        }

        if (password === confirmPassword) {
            return res.status(500).json({
                sucess: false,
                message: 'password and confirm password are not same ',
            })
        }

        if (password.length < 6) {
            return res.status(500).json({
                sucess: false,
                message: 'password is too short'
            })
        }

        console.log('Checking if user exists...');
        const exist = await User.findOne({ email: email });

        if (exist) {
            return res.status(409).json({
                success: false,
                message: 'Email already exists. Please log in.'
            });
        }

        const salt = bcrypt.genSaltSync(10);
        const newPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            userName,
            email,
            password: newPassword,
            role
        });

        req.session.userId = newUser._id;

        if (newUser.role.toLowerCase() == 'student') {
            const allCourse = await courses.find();
            const enrolledCourses = await courses.find({ enrolledStudents: { $in: [newUser._id] } });

            return res.json({
                sucess: true,
                message: 'student loged in',
                allCourse,
                enrolledCourses
            })
        }

        if (newUser.role.toLowerCase() == 'faculty') {
            const allCourse = await courses.find();
            // const enrolledCourses = await courses.find({ enrolledStudents: { $in: [newUser._id] } });

            return res.json({
                sucess: true,
                message: 'faculty loged in',
                allCourse,
            })
        }

        if (newUser.role.toLowerCase() == 'admin') {
            const allCourse = await courses.find();
            // const enrolledCourses = await courses.find({ enrolledStudents: { $in: [newUser._id] } });

            return res.json({
                sucess: true,
                message: 'admin loged in',
                allCourse,
                // enrolledCourses
            })
        }

    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        console.log('Inside login route');

        const { userName, email, password } = req.body;

        if (!userName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all the credentials'
            });
        }

        console.log('Checking if user exists...');
        const exist = await User.findOne({ email: email });

        if (!exist) {
            return res.status(401).json({
                success: false,
                message: 'Email is not registered. Please double-check it.'
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, exist.password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect password. Please try again.'
            });
        }
        console.log(exist._id)
        req.session.UserId = exist._id;
        console.log(exist._id)


        if (exist.role.toLowerCase() == 'student') {
            const allCourse = await courses.find();
            const enrolledCourses = await courses.find({ enrolledStudents: { $in: [exist._id] } });

            return res.json({
                sucess: true,
                message: 'student loged in',
                allCourse,
                enrolledCourses
            })
        }

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

router.get('/auth/google', passport.authenticate('google', {
    scope:
        ['email', 'profile']
}));

router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/success',
    failureRedirect: '/faliure'
}));

router.get('/success', (req, res) => {
    console.log(req.user);
    res.json({
        sucess: true,
        message: 'successfull authentication',
    })
})

router.get('/faliure', (req, res) => {
    res.json({
        sucess: false,
        message: 'failed to authenticate'
    })
});

router.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] }));

router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function (req, res) {

        res.json('/');
    });


module.exports = router;
