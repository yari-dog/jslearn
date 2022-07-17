const express = require('express');
const path = require('path');
const auth = require('../middleware/auth')
const authz = require('../middleware/authz')
const router = express.Router();

router.get('/public/:id/:path', auth(), (req, res) => {
    res.sendFile(path.resolve(__dirname,'..','www','userStorage','public',req.params.id,req.params.path))
})

module.exports = router;