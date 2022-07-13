const jwt = require('jsonwebtoken')
const {User} = require('../../models/user')
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const config = require('config');
const auth = require('../../middleware/auth')
const router = express.Router();

router.get('/', auth(), (req, res) => {
    res.sendStatus(200)
})

router.post('/login', async (req, res) => {
    if (req.cookies['x-access-token'] || req.cookies['x-refresh-token']) return res.status(400).send('Already Logged In')
    let isUsernameLogin
    if (!req.body.email && req.body.username) {
        isUsernameLogin = true
    } else if (!req.body.username && req.body.email) {
        isUsernameLogin = false
    }
    else if (req.body.username && req.body.email) return res.status(400).send('Username and Username both supplied')
    else return res.status(400).send('Username or Email required')
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    var user
    if (!isUsernameLogin) user = await User.findOne({email: req.body.email});
    else user = await User.findOne({username: req.body.username});
    if (!user) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password');
    var {refreshToken, accessToken} = await user.genNewTokens(req.ip);
    user = user.save()
    let date = new Date();
    date.setDate(date.getDate() + 7 )
    date.toUTCString()
    res.cookie('x-refresh-token', refreshToken, {
        secure: config.get('env') !== "testing",
        samesite: true,
        httpOnly: true,
        expires: date
    })
    date = new Date()
    date.setTime(date.getTime() + 60 * 60 * 1000)
    res.cookie('x-access-token', accessToken, {
        secure: config.get('env') !== "testing",
        samesite: true,
        httpOnly: true,
        expires: date
    })
    res.sendStatus(200)
})

router.post('/refresh', auth(true), async (req, res) => {
    const {refreshToken, accessToken} = await req.body.user.genNewTokens(req.ip, req.body.token);
    let user = req.body.user.save()

    let date = new Date();
    date.setDate(date.getDate() + 7 )
    date.toUTCString()
    res.cookie('x-refresh-token', refreshToken, {
        secure: config.get('env') !== "testing",
        samesite: true,
        httpOnly: true,
        expires: date
    })
    date = new Date()
    date.setTime(date.getTime() + 60 * 60 * 1000)
    res.cookie('x-access-token', accessToken, {
        secure: config.get('env') !== "testing",
        samesite: true,
        httpOnly: true,
        expires: date
    })
    res.sendStatus(200)
})

router.post('/logout', auth(), async (req, res) => {
    req.body.user.dropAllTokens();
    res.clearCookie('x-refresh-token');
    res.clearCookie('x-access-token');
    res.sendStatus(200)
})

router.post('/logtoken', async (req, res) => {
    //console.log(jwt.verify(req.header('token'), config.get('jwtPrivateKey')))
    let token
    if (req.query.refresh === 'true') {
        token = req.cookies['x-refresh-token']
    } else {
        token = req.cookies['x-access-token']
    }
    if (token) token = jwt.verify(token, config.get('jwtPrivateKey'))
    console.log(token)
    res.sendStatus(200)
})

function  validate(req)  {
    const schema = Joi.object({
        username: Joi.string().min(3).max(50),
        email: Joi.string().min(3).max(255).email(),
        password: Joi.string().min(3).max(255).required()
    })

    return schema.validate(req);
};

module.exports = router;