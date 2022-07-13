const {User, validate} = require('../../models/user')
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('*', (req, res) => {
    res.sendStatus(200)
})

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({username: req.body.username});
    if (user) return res.status(400).send('Username already in use');
    user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('Email already in use');

    user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt)

    user = await user.save()
    res.send({username: user.username, email: user.email})
})


module.exports = router;