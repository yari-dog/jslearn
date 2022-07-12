const jwt = require('jsonwebtoken')
const Joi = require('joi')
const config = require('config')
const mongoose = require('mongoose')
const { token } = require('morgan')

const tokenSchema = new mongoose.Schema({
    isValid: {
        type: Boolean,
        default: true
    }
})

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        unique: true
    },
    email: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 1024
    },
    tokens: [tokenSchema]
})

userSchema.methods.generateRefreshToken = async function(ip) {
    const tokenNumber = this.tokens.push({})
    const user = await this.save()
    const refreshToken = jwt.sign({ _id: user.tokens[tokenNumber-1]._id, uid: this._id, ip: ip}, config.get('jwtPrivateKey'));
    return {refreshToken, user};
}

userSchema.methods.generateAccessToken = async function(refreshToken) {
    const token = jwt.verify(refreshToken, config.get('jwtPrivateKey'))
    const accessToken = jwt.sign({ _id: token._id, uid: this._id, isAccess: true, ip: token.ip}, config.get('jwtPrivateKey'));
    return accessToken;
}

userSchema.methods.getToken = function(id) {
    var foundToken = null;
    var index = null;
    this.tokens.forEach( (token, i) => {
        if (token._id == id) {
            foundToken = token;
            index = i-1;
        }
    })
    return foundToken;
}

userSchema.methods.invalidateToken = async function(id) {
    this.getToken(id).isValid = false
    return this.save()
}

userSchema.methods.dropToken = async function(id) {
    this.tokens.pull(this.getToken(id))
    return this.save();
}

userSchema.methods.dropAllTokens = async function() {
    this.tokens = []
    return this.save();
}

userSchema.methods.validateToken = async function(token) {
    
}

userSchema.methods.genNewTokens = async function(ip,refresh) {
    if (refresh) {
        this.invalidateToken(refresh._id);
        var user = await this.save();
    } else { var user = this }
    var {refreshToken, user} = await user.generateRefreshToken(ip);
    const accessToken = await user.generateAccessToken(refreshToken);
    return {refreshToken, accessToken, user};
}



const User = new mongoose.model('User', userSchema)

function  validateUser(user)  {
    const schema = Joi.object({
        username: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(3).max(255).required()
    })

    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;