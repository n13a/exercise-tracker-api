const mongoose = require('mongoose')
const { Schema } = mongoose

const ExerciseSchema = new Schema({
    userId: String,
    description: String,
    duration: Number,
    date: Date,
})

module.exports = mongoose.model("Exercise", ExerciseSchema);