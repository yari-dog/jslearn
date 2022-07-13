const express = require('express');
const path = require('path');
const auth = require('../../middleware/auth')
const router = express.Router();

router.post('/', auth(), (req, res) => {
    res.sendStatus(200)
})

router.get('/', auth(), (req, res) => {
    res.send(req.body.user.username)
})


module.exports = router;