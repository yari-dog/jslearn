const express = require('express');
const path = require('path');
const auth = require('../middleware/auth')
const authz = require('../middleware/authz')
const router = express.Router();


router.get('/*', auth(), (req, res) => {
    res.sendFile(path.join(__dirname,'..','www','userStorage',req.path))
})

module.exports = router;