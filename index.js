const express = require('express');
const session = require('express-session');
const cors = require('cors')
require('dotenv').config();
require('./databases/conn');

const app = express();
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

app.use(cors({
    origin:"https://roaring-scone-01e7f7.netlify.app/",
    credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/user", require('./routes/authRoutes'));
app.use("/admin", require('./routes/adminRoutes'));
app.use("/student", require('./routes/adminRoutes'));
app.use("/faculty", require('./routes/adminRoutes'));

app.get('/', (req, res) => {
    res.send('Hello World');
});



app.listen(3000, () => {
    console.log('app is listining to port 3000');
})