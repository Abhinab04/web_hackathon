const express = require('express');
const session = require('express-session');
const courses = require('../models/courses');
const user = require('../models/user');
const notification = require('../models/notificaton');
const path = require('path');
const assingnment = require('../models/assignments');
const Quiz = require('../models/quiz');
const scores = require('../models/scores');
const multer = require('multer');
const pdf = require('pdf-parse');
const fs = require('fs');

const router = express.Router();

const storageLecture = multer.diskStorage({
    destination: "./uploaded/LecturePDF/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const uploadLecture = multer({ storageLecture });

const requireFaculty = (req, res, next) => {
    if (!req.session.userId || req.session.userId !== 'faculty') {
        return res.status(403).json({ success: false, message: "Access denied. Only faculty can manage courses." });
    }
    next();
};


router.get('/admin', requireFaculty, async (req, res) => {
    const course = await courses.find();
    res.json({
        success: true,
        message: 'admin login sucessful',
        courses: course
    })
});

router.get('/createCourse', requireFaculty, async (req, res) => {
    res.json({
        success: true,
        message: 'create course here'
    })
});

router.post('/createCourses', async (req, res) => {
    try {
        console.log('Inside create course route');

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
        const newCourse = await courses.create({
            courseName,
            description,
            price,
        });
        res.json({
            message: 'course created',
            sucess: true,
        })

    } catch (error) {
        console.log(error);
    }
});

router.put('/update/:courseName', requireFaculty, uploadLecture.single("file"), async (req, res) => {
    try {
        const { courseName } = req.params;
        const { description, content, price } = req.body;

        const course = await courses.findOne({ courseName });
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        course.courseName = courseName || course.courseName;
        course.description = description || course.description;
        course.price = price || course.price;

        if (req.file) {
            try {
                const filePath = req.file.path;
                const savePath = path.join(__dirname, `../parsed_texts/${req.file.originalname}.txt`);

                const dataBuffer = fs.readFileSync(filePath);
                const parsedData = await pdf(dataBuffer);

                fs.writeFileSync(savePath, parsedData.text);
                console.log('PDF text extracted and saved successfully.');

                course.content = [{
                    type: 'pdf',
                    title: req.file.originalname,
                    path: savePath
                }];

            } catch (fileError) {
                console.error('Error processing file:', fileError);
                return res.status(500).json({ success: false, message: "Error processing PDF file" });
            }
        }

        await course.save();
        res.json({ success: true, message: "Course updated successfully", course });

    } catch (error) {
        console.error('Update Error:', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

const storageAssignment = multer.diskStorage({
    destination: "./uploaded/Assignments/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const uploadAssignment = multer({ storage: storageAssignment });

router.post('/uploadAssignment', uploadAssignment.single("file"), async (req, res) => {
    const { deadline } = req.body;

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Nothing is uploaded buddy"
        });
    }

    try {
        const filePath = req.file.path;
        const savePath = path.join(__dirname, `../Assignment_texts/${req.file.originalname}.txt`); // use `.txt` instead of `.pdf` here

        const dataBuffer = fs.readFileSync(filePath);

        const data = await pdf(dataBuffer);

        fs.writeFileSync(savePath, data.text);
        console.log('PDF text extracted and saved successfully.');

        const newAssignment = await assignment.create({
            AssignmentTitle: req.file.originalname,
            DeadLine: deadline,
            filePath: filePath,
            extractedTextPath: savePath
        });

        return res.status(201).json({
            success: true,
            message: "Assignment uploaded successfully",
            assignment: newAssignment
        });

    } catch (error) {
        console.error('Error processing file:', error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

router.post('/notification', requireFaculty, async (req, res) => {
    const { Uploadednotification } = req.body;
    const id = req.session.userId;
    const user = await user.findById(id);
    const newNotification = await notification.create({
        Uploadednotification,
        role: user.role,
        name: user.userName,
    });
});



router.post('/createQuiz', requireFaculty, async (req, res) => {
    try {
        const { courseId, questions } = req.body;

        const courseExists = await courses.findById(courseId);
        if (!courseExists) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ success: false, message: 'Questions must be an array and cannot be empty' });
        }

        for (let q of questions) {
            if (!q.question || !Array.isArray(q.options) || q.options.length < 4 || q.correctIndex === undefined) {
                return res.status(400).json({
                    success: false,
                    message: 'Each question must have a question text, at least four options, and a correctIndex',
                });
            }
        }

        const id = req.session.userId;


        const newQuiz = new Quiz({
            courseId,
            questions,
            createdBy: id
        });

        await newQuiz.save();

        res.status(201).json({
            success: true,
            message: 'Quiz created successfully',
            quiz: newQuiz,
        });
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

router.get('/CheckAssignment', requireFaculty, async (req, res) => {
    const { studentId, AssignmentTitle } = req.body;
    const exist = await assingnment.find({ AssignmentTitle: AssignmentTitle, studentId: studentId });

    res.json({
        success: true,
        exist,
    })

});

router.post('/checkAssignment', requireFaculty, async (req, res) => {
    const { AssignmentTitle, score, studentId } = req.body;

    const exist = await scores.findOne({ AssignmentTitle: AssignmentTitle, studentId: studentId });
    const updateScore = await scores.findByIdAndUpdate(exist._id, { score: score });

    res.json({
        sucess: true,
        message: 'Scores updated',
    })

})

router.get('/allNotification', async (req, res) => {
    const notifications = await notificaton.find();
    res.json({
        notifications,
    })
});


module.exports = router;
