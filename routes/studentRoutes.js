const express = require('express');
const Course = require('../models/Course');
const { requireAuth } = require('../middlewares/auth');
const Assignment = require('../models/assignments');

const router = express.Router();

const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

router.get('/all', async (req, res) => {
    const courses = await Course.find()
    res.json({ courses });
});

router.post('/enroll/:courseName', requireAuth, async (req, res) => {
    const course = await Course.findOne({ courseName: req.params.courseName });
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.enrolledStudents.push(req.userId);
    await course.save();

    res.json({ message: "Enrolled successfully", course });
});

router.post('/submit/:assignmentId', requireAuth, upload.single('file'), async (req, res) => {
    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    assignment.submissions.push({ studentId: req.userId, fileUrl: req.file.path });
    await assignment.save();

    res.json({ message: "Assignment submitted successfully" });
});


module.exports = router;
