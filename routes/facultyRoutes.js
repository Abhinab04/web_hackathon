const express = require('express');
const session = require('express-session');
const courses = require('../models/courses');
const user = require('../models/user');
const notification = require('../models/notificaton');
const path = require('path');
const assingnment = require('../models/assignments');

const router = express.Router();

const requireLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/');
    }
    next();
};

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

router.put('/update/:courseName', requireFaculty, uploadLecture.single("file"), async (req, res) => {
    try {
        const { courseId } = req.params;
        const { courseName, description, content, price } = req.body;

        const course = await courses.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }



        // ✅ Update course details
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

const storageAssingnment = multer.diskStorage({
    destination: "./uploaded/Assingnments/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const uploadAssignment = multer({ storageAssingnment });

router.post('/uploadAssingment', requireFaculty, uploadLecture.single("file"), async (req, res) => {
    const { deadline } = req.body;
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Nothing is uploaded buddy"
        });
    }
    try {
        const filePath = req.file.path;
        const savePath = path.join(__dirname, `../Assignment_texts/${req.file.originalname}.pdf`);

        let dataBuffer = fs.readFileSync(filePath);

        pdf(dataBuffer).then((data) => {
            try {
                fs.writeFileSync(savePath, data.text);
                console.log('PDF text extracted and saved successfully.');

                const newAssingnment = assingnment.create({
                    AssignmentTitle: req.file.originalname,
                    DeadLine: deadline
                });

            } catch (error) {
                console.error('Error writing extracted text:', error);
            }
        }).catch((err) => {
            console.error('Error parsing PDF:', err);
        });

    }
    catch (error) {
        console.error('Error processing file:', error);
    }

});

router.post('/notification', async (req, res) => {
    const { Uploadednotification } = req.body;
    const id = req.session.userId;
    const user = await user.findById(id);
    const newNotification = await notification.create({
        Uploadednotification,
        role: user.role,
        name: user.userName,
    });
})

module.exports = router;
