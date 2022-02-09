const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, email: {
        type: String,
        required: true,
        unique: true
    }, password: {
        type: String,
        required: true
    }, emailToken: {
        type: String,
    }, isVerified: {
        type: Boolean,
        default: false
    }, date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('User', userSchema)