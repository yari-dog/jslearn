const mongoose = require('mongoose')

const elementSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    data: Object
})

const sectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    body: [elementSchema]
})

const lessonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sections: {
        type: [sectionSchema],
        required: true
    },
})

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: String,
    lessons: [lessonSchema],
    tags: [[String]]
})

courseSchema.methods.addLesson = function(lesson) {
    this.lessons.push(lesson)
}

const Course = new mongoose.model('Course', courseSchema)

exports.Course = Course;