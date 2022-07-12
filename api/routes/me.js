const express = require('express');
const path = require('path');
const auth = require('../../middleware/auth')
const router = express.Router();

router.post('/', auth(), (req, res) => {
    console.log('test')
    res.sendStatus(200)
})

router.get('/', auth(), (req, res) => {
    res.sendStatus(200)
})


module.exports = router;