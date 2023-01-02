const mongoose = require('mongoose')
const { Schema } = mongoose

const User = new Schema({
    username: String

}, { versionKey: false })

module.exports = mongoose.model("User", User);