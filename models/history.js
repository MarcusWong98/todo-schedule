const mongoose = require('mongoose');

const history = mongoose.Schema({
    dateID: {
        type: String,
        required: true
    },
    time:{
        type: String,
        required: true
    },
    todo:{
        type: String,
        required:true
    }
})

module.exports = mongoose.model('History', history);