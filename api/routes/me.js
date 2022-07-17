const express = require('express');
const path = require('path');
const auth = require('../../middleware/auth');
const { User } = require('../../models/user');
const {Course} = require('../../models/course');
const router = express.Router();

router.post('/', auth(), (req, res) => {
    res.sendStatus(200)
})

router.get('/', auth(), (req, res) => {
    res.send(req.body.user.username)
})

router.get('/courses', auth(), async (req, res) => {
    res.send( await User.findById(req.body.user._id).populate({path: 'courses._id', select: 'name description lessons.name lessons._id'}).select('courses').exec())
})

router.get('/:id/completedLessons', auth(), async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send('course not found');
    let lessons = []
    for (const lesson of course.lessons) {
        if (req.body.user.courses.find(courseObj => {return courseObj._id.toString() === req.params.id}).completed.find(lessonObj => {return lessonObj._id.toString() === lesson._id.toString()})){
            lessons.push(lesson)
        }
    }
    res.send(lessons) 
})

router.put('/courses/:id', auth(), async (req, res) => {
    req.body.user.enrollCourse(req.params.id)
    const user = await req.body.user.save()
    res.send(user.courses)
})

router.put('/courses/:course/lessons/:lesson', auth(), async (req, res) => {
    const error = req.body.user.completeLesson(req.params.course, req.params.lesson)
    if (error) return res.status(400).send(error)
    const user = await req.body.user.save()
    res.send(user.courses)
})

module.exports = router;