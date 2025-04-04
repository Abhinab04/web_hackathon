const express = require('express');
const schema = require('../models/user');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const moment = require('moment');
const courses = require('../models/courses');
// require('dotenv').config();

const router = express.Router();

router.get("/hello", (req, res) => {
    res.send("hellow")
})

router.post('/signup', async (req, res) => {
    console.log('signup k andar');
    try {
        const { name, email, password, confirm, role } = req.body;
        let error = [];
        console.log(name, email, password, confirm, role)
        console.log('try k andar');

        if (name === '' || email === '' || !password === '' || !confirm === '' || !role === '') {
            error.push({ msg: "Please fill all the blanks" })
        }

        if (!validator.isEmail(email)) {
            error.push({ msg: "Email is not valid" });
        }

        if (password !== confirm) {
            error.push({ msg: "Password mismatch" })
        }

        if (password.length < 6) {
            error.push({ msg: "password is too short" })
        }
        if (!role === 'student' || !role === 'faculty' || !role === 'admin') {
            error.push({ msg: "Invalid input for role" })
        }
        if (error.length > 0) {
            return res.json({ sucess: false, msg: "re render the register", error })
        }

        const exist = await schema.findOne({ email: email })
        if (exist) {
            error.push({ msg: 'username already exist' })
            return res.json({
                sucess: false,
                message: 'user already exits try to sinup',
                error
            })
        }
        var salt = bcrypt.genSaltSync(15);
        const newPassword = await bcrypt.hash(password, salt);


        const newuser = await schema.create({
            userName: name,
            email: email,
            password: newPassword,
            role: role
        })
        req.session.userId = newuser._id;
        if (newuser.role.toLowerCase() == 'admin') {
            const today = moment().toDate();

            try {
                const upcomingCourses = await courses.find({ StartDate: { $gt: today } });

                const ongoingCourses = await hackathon.find({
                    StartDate: { $lte: today },
                });
                req.session.userId = exist._id;
                return res.json({
                    sucess: true,
                    message: 'new Admin Created',
                    upcomingCourses,
                    ongoingCourses
                })

            } catch (error) {
                console.log(error);
            }

        }
    } catch (error) {
        console.log(error);
        return res.status(500).json('Internal Server Error');
    }
})

// Login Route
// router.get('/login',(req,res)=>{
//     res.send("hello world")
// })
router.post('/login', async (req, res) => {
    let error = []; // Store errors here

    try {
        console.log('Inside login route');

        const { email, password } = req.body;
        console.log('Received credentials:', email, password);

        // Validate input fields
        if (!email || !password) {
            error.push({ msg: "Please fill all the blanks" });
        }

        console.log('Checking if user exists...');
        const exist = await schema.findOne({ email: email });

        if (!exist) {
            error.push({ msg: "User is not registered" });
        } else {
            // Check password only if user exists
            const isPasswordMatch = await bcrypt.compare(password, exist.password);
            if (!isPasswordMatch) {
                error.push({ msg: "Password doesn't match" });
            }
        }

        // If there are any errors, return response with errors
        if (error.length > 0) {
            return res.json({ success: false, msg: "Re-render the login", error });
        }

        // Store session data
        req.session.userId = exist._id;
        console.log('User ID stored in session:', req.session.userId);

        // Respond based on role
        return res.json({
            success: true,
            msg: `${exist.role} logged in`,
            role: exist.role.toLowerCase()
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});



module.exports = router;