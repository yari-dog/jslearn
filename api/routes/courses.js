const {Course} = require('../../models/course')
const auth = require('../../middleware/auth')
const authz = require('../../middleware/authz')
const express = require('express');
const path = require('path');
const { User } = require('../../models/user');
const router = express.Router();



router.post('/', auth(), async (req, res) => {
    console.log(req.body.course)
    const bodyCourse = req.body.course;
    let lessons = []
    for (const lesson of bodyCourse.lessons) {
        const name = lesson.name;
        let sections = [];
        for (const section of lesson.sections) {
            const sectionName = section.name;
            const sectionBody = section.body;
            sections.push({name: sectionName, body: sectionBody})
        }
        lessons.push({name: name, sections: sections})
    }
    let courseObject = {
        name: bodyCourse.name,
        creator: req.body.user._id,
        tags: bodyCourse.tags,
        lessons: bodyCourse.lessons
    };
    console.log(courseObject)

    let course = new Course(courseObject);
    course = await course.save()
    res.send(course)
})

router.post('/:id/lessons', auth(), authz({owner: true},'Course'), async (req, res) => {
    if (!req.body.lesson && !req.body.lessons) return res.status(400).send('no lesson');
    let course = await Course.findById(req.params.id);
    if (!course) return res.sendStatus(404);

    if(req.body.lessons) {
        for (const lesson of req.body.lessons) {
            course.addLesson(lesson)
        }
    } else {
        course.addLesson(req.body.lesson);
    }
    course = await course.save();
    res.status(200).send(course)
})

router.get('/', auth(), async (req, res) => {
    let query
    if (!Object.keys(req.query).length) query = Course.find().limit(5).populate({path:'creator',select:'username'});
    query = await query.exec()
    res.send(query)
})

router.get('/:id', auth(), async (req, res) => {
    let query = Course.findById(req.params.id);
    query.populate({path:'creator',select:'username'}).select('name creator description tags lessons.name lessons._id');
    let course = await query.exec();
    if (!course) return res.sendStatus(404);
    res.send(course)
})

router.get('/:course/lessons/:lesson', auth(), async (req, res) => {
    let query = Course.findById(req.params.course);
    query.populate({path:'creator',select:'username'}).select({"name":1, "creator":1, "lessons":{"$elemMatch":{"_id":req.params.lesson}}})
    const course = await query.exec();
    res.send(course);
})


router.put('/:id', auth(), authz({owner: true},'Course'), async (req, res) => {
    if (!req.body.course) return res.sendStatus(400);
    let course = await Course.findByIdAndUpdate(req.params.id, req.body.course, {new: true});
    res.status(200).send(course);
})

router.put('/:id/lessons/:lesson', auth(), authz({owner: true},'Course'), async (req, res) => {
    if (!req.body.lesson) return res.sendStatus(400);
    console.log(req.params.id, req.params.lesson)
    let course = await Course.findByIdAndUpdate(
        {_id:  req.params.id, "lessons._id": req.params.lesson}, 
        {"$": req.body.lesson},
        {new: true});
    res.status(200).send(course);
})

/*  
{
    name: String,
    creator: Auth'd user,
    tags: [],
    lessons: [
        name: String,
        sections: [
            name: String,
            body: [
                type: String,
                data: Object (innerHTML, html tag etc)
            ]
        ]
    ]
}
*/
module.exports = router;