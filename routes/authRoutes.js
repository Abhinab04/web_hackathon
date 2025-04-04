const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
// require('dotenv').config();

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

        return res.status(201).json({
            success: true,
            message: `${role} has signed up successfully`
        });

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
            return res.json({
                sucess: true,
                message: 'student loged in'
            })
        }

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = router;
