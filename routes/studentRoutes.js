const express = require('express');
const Course = require('../models/courses');
const quiz = require('../models/quiz');
const multer = require('multer');
const Assignment = require('../models/assignments');


const router = express.Router();

const requireStudent = (req, res, next) => {
    if (!req.session.userId || req.session.userId !== 'student') {
        return res.status(403).json({ success: false, message: "Access denied. Only faculty can manage courses." });
    }
    next();
};

const storage = multer.diskStorage({
    destination: "./uploads/submittedAssignments",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

router.get('/all', async (req, res) => {
    const courses = await Course.find()
    res.json({ courses });
});

router.post('/enroll/:courseName', async (req, res) => {
    try {
        const course = await Course.findOne({ courseName: req.params.courseName });
        if (!course) return res.status(404).json({ message: "Course not found" });

        // Prevent duplicate enrollment
        if (!course.enrolledStudents.includes(req.session.userId)) {
            course.enrolledStudents.push(req.session.userId);
            await course.save();
            return res.json({ message: "Enrolled successfully", course });
        } else {
            return res.status(400).json({ message: "Already enrolled in this course" });
        }
    } catch (err) {
        console.error("Enrollment error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.post('/submit/:assignmentId', requireStudent, upload.single('file'), async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        if (!req.file || !req.file.path) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const alreadySubmitted = assignment.submissions.find(sub =>
            sub.studentId.toString() === req.session.userId
        );
        if (alreadySubmitted) {
            return res.status(400).json({ message: "Assignment already submitted" });
        }

        assignment.submissions.push({
            studentId: req.session.userId,
            fileUrl: req.file.path
        });

        await assignment.save();

        res.json({ message: "Assignment submitted successfully" });

    } catch (err) {
        console.error("Submission error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.get('/quiz', requireStudent, async (req, res) => {
    const enrolledCourses = await Course.find({ enrolledStudents: { $in: [exist._id] } });

    const enrolledCourseIds = enrolledCourses.map(course => course._id);

    const quizes = await quiz.find({ courseId: { $in: enrolledCourseIds } });

    res.json({
        success: true,
        quizes,
    });

});
router.post('/submit/:quizId', requireStudent, async (req, res) => {
    try {
        const { quizId } = req.params;
        const { studentId, answers } = req.body;

        const quiz = await quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        let score = 0;
        quiz.questions.forEach((q, index) => {
            if (q.correctIndex === answers[index]) {
                score += 1;
            }
        });

        quiz.submissions.push({ studentId, answers, score });
        await quiz.save();

        res.json({ success: true, message: 'Quiz submitted successfully', score });
    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

router.get('/results/:quizId/:studentId', requireStudent, async (req, res) => {
    try {
        const { quizId, studentId } = req.params;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        const submission = quiz.submissions.find(sub => sub.studentId.toString() === studentId);
        if (!submission) {
            return res.status(404).json({ success: false, message: 'No submission found for this student' });
        }

        res.json({ success: true, submission });
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


module.exports = router;
