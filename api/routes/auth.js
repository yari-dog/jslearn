const jwt = require('jsonwebtoken')
const {User} = require('../../models/user')
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const config = require('config');
const auth = require('../../middleware/auth')
const router = express.Router();

router.get('*', (req, res) => {
    res.sendStatus(200)
})

router.post('/login', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    var user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password');
    var {refreshToken, accessToken, user} = await user.genNewTokens(req.ip);
    const date = new Date();
    date.setDate(date.getDate() + 7 )
    date.toUTCString()
    res.cookie('x-refresh-token', refreshToken, {
        secure: config.get('env') !== "testing",
        samesite: true,
        httpOnly: true,
        expires: date
    })
    res.header('x-access-token', accessToken)
    res.send(200)
})

router.post('/refresh', auth(true), async (req, res) => {
    //var {refreshToken, accessToken, user} = await user.genNewTokens();

    res.sendStatus(200)
    //res.header('x-access-token', accessToken).header('x-refresh-token', refreshToken).send(200)
})

router.post('/logout', auth, async (req, res) => {
    req.body.user.dropAllTokens();
    res.sendStatus(200)
})

router.post('/logtoken', async (req, res) => {
    console.log(jwt.verify(req.header('token'), config.get('jwtPrivateKey')))
    res.sendStatus(200)
})

function  validate(req)  {
    const schema = Joi.object({
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(3).max(255).required()
    })

    return schema.validate(req);
};

module.exports = router;