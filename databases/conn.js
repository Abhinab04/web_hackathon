const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/glitch', {

}).then(() => {
    console.log('connection eshtablished');
}).catch((e) => {
    console.log(e);
    console.log('connection not eshtablished');
});