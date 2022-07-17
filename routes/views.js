const express = require('express');
const path = require('path');
const auth = require('../middleware/auth')
const router = express.Router();

router.get('/login', async (req, res) => {
    if (req.cookies['x-refresh-cookie'] || req.cookies['x-access-cookie']){
        res.status(400).send('already logged in, maybe incorrectly')
    }
    res.sendFile(path.resolve(__dirname, '..','www','static','html','views','login.html'));
})

router.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..','www','static','html','views','view.html'))
})

router.get('/:view', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..','www','static','html','views',req.params.view.concat('.html')));
})

router.get('/courses/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..','www','static','html','views','course.html'))
})
module.exports = router;