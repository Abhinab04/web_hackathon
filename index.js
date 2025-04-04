const express = require('express');
const session = require('express-session');
// require('dotenv').config();
require('./databases/conn');

const app = express();
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("", require('./routes/adminRoutes'));
app.use("", require('./routes/authRoutes'));

// app.get('/', (req, res) => {
//     res.send('Hello World');
// });



app.listen(3000, () => {
    console.log('app is listining to port 3000');
})