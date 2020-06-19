const mongoose = require('mongoose');

const schedule = mongoose.Schema({
    dateID: {
        type:String,
        required: true
    },
    todo:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Schedule', schedule);