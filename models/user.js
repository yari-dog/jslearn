const jwt = require('jsonwebtoken')
const Joi = require('joi')
const config = require('config')
const mongoose = require('mongoose')
const { string } = require('joi')

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
    tags: [[String]],
    tokens: [tokenSchema],
    profilePicture: String,
    courses: [{
        _id:{type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
        completed: [{
            _id: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'}
        }]
    }]
})

userSchema.methods.generateRefreshToken = async function(ip) {
    const tokenNumber = this.tokens.push({})
    const refreshToken = jwt.sign({ _id: this.tokens[tokenNumber-1]._id, uid: this._id, ip: ip}, config.get('jwtPrivateKey'));
    return await refreshToken;
}

userSchema.methods.generateAccessToken = async function(refreshToken) {
    const token = jwt.verify(refreshToken, config.get('jwtPrivateKey'))
    const accessToken = jwt.sign({ _id: token._id, uid: this._id, isAccess: true, ip: token.ip}, config.get('jwtPrivateKey'));
    return accessToken;
}

userSchema.methods.getToken = function(id) {
    for (const token of this.tokens) {
        if (token._id.equals(id)) return token;
    } return false;
}

userSchema.methods.invalidateToken = async function(id) {
    this.getToken(id).isValid = false
}

userSchema.methods.dropToken = async function(id) {
    this.tokens.pull(this.getToken(id))
}

userSchema.methods.dropAllTokens = async function() {
    this.tokens = []
}

userSchema.methods.validateToken = async function(token) {
    
}

userSchema.methods.enrollCourse = function (course) {
    this.courses.push(course)
}

userSchema.methods.completeLesson = function (courseID, lessonID) {
    //this.courses.find({_id: course}).push(lesson)
    for (const course of this.courses) {
        if (course._id.toString() ===  courseID) {
            for (const lesson of course.completed){
                if (lesson._id.toString() == lessonID) {
                    return 'already completed';
                }
            }
            course.completed.push(lessonID);
            return;
        }
    }
    return 'could not find course in user';
}

userSchema.methods.genNewTokens = async function(ip,refresh) {
    if (refresh) {
        this.invalidateToken(refresh._id);
    }
    const refreshToken = await this.generateRefreshToken(ip);
    const accessToken = await this.generateAccessToken(refreshToken);
    return {refreshToken, accessToken};
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