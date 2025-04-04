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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/user", require('./routes/authRoutes'));
app.use("", require('./routes/adminRoutes'));

app.get('/', (req, res) => {
    res.send('Hello World');
});



app.listen(3000, () => {
    console.log('app is listining to port 3000');
})