const express = require('express');
const path = require('path');
const router = express.Router();

const me = require('../api/routes/me')
const auth = require('../api/routes/auth')
const courses = require('../api/routes/courses')
const login = require('../api/routes/login')
const users = require('../api/routes/users')

router.use('/me', me)
router.use('/auth', auth)
router.use('/courses', courses)
router.use('/login', login)
router.use('/users', users)

module.exports = router;