const express = require('express');
const session = require('express-session');
const courses = require('../models/courses');
const user = require('../models/user');
const notification = require('../models/notificaton');

const router = express.Router();

const storageLecture = multer.diskStorage({
    destination: "./uploaded/LecturePDF/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const uploadLecture = multer({ storageLecture });

const requireAdmin = (req, res, next) => {
    if (!req.session.userId || req.session.userId !== 'admin') {
        return res.status(403).json({ success: false, message: "Access denied. Only faculty can manage courses." });
    }
    next();
};

router.get('/admin', requireAdmin, async (req, res) => {
    const course = await courses.find();
    res.json({
        success: true,
        message: 'admin login sucessful',
        courses: course
    })
});

router.get('/createCourse', requireAdmin, async (req, res) => {
    res.json({
        success: true,
        message: 'create course here'
    })
});

router.post('/createCourse', requireAdmin, async (req, res) => {
    try {
        console.log('Inside signup route');

        const { courseName, description, price, startDate } = req.body;

        if (!courseName || !description || !price || !startDate) {
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
            startDate,
        });

    } catch (error) {
        console.log(error);
    }
});

router.get('/allStudentss/:page', requireAdmin, async (req, res) => {
    try {
        page = parseInt(req.params.page) || 1;
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

router.get('/allFaculty/:page', requireAdmin, async (req, res) => {
    try {
        page = parseInt(req.params.page) || 1;
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

router.post('/editBatch', requireAdmin, async (req, res) => {
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

router.post('/notification', requireAdmin, async (req, res) => {
    const { Uploadednotification } = req.body;
    const id = req.session.userId;
    const user = await user.findById(id);
    const newNotification = await notification.create({
        Uploadednotification,
        role: user.role,
        name: user.userName,
    });
})

router.get('/allNotification', async (req, res) => {
    const notifications = await notificaton.find();
    res.json({
        notifications,
    })
});

router.put('/update/:courseName', requireAdmin, uploadLecture.single("file"), async (req, res) => {
    try {
        const { courseId } = req.params;
        const { courseName, description, content, price } = req.body;

        const course = await courses.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        course.title = title || course.title;
        course.description = description || course.description;
        if (content) {
            try {
                const filePath = req.file.path;
                const savePath = path.join(__dirname, `../parsed_texts/${req.file.originalname}.pdf`);

                let dataBuffer = fs.readFileSync(filePath);

                pdf(dataBuffer).then((data) => {
                    try {
                        fs.writeFileSync(savePath, data.text);
                        console.log('PDF text extracted and saved successfully.');

                        course.content = [{ type: 'pdf', title: req.file.originalname, path: savePath }];
                    } catch (error) {
                        console.error('Error writing extracted text:', error);
                    }
                }).catch((err) => {
                    console.error('Error parsing PDF:', err);
                });

            } catch (error) {
                console.error('Error processing file:', error);
            }
        }

        await course.save();
        res.json({ success: true, message: "Course updated successfully", course });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

module.exports = router;
