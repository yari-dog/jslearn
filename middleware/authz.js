const jwt = require('jsonwebtoken')
const {User} = require('../models/user')
const {Course} = require('../models/course')
const config = require('config');
const resources = {User, Course}

module.exports = function auth(tags, resource) {
    return async function(req, res, next) {
        
        if (req.body.user.tags.includes('admin')) {
            console.log('admin account');
             next();
        } else {
        if (tags.blacklist) {
            for (const tag of tags.blacklist) {
                for (const userTag of req.body.user.tags){
                    if (userTag === tag) return sendError(403,'Unauthorised, Blacklisted User Tag', res);
                }
            }
        }
        if (tags.required) {
            for (const tag of tags.required) {
                let found = false;
                for (const userTag of req.body.user.tags) {
                    console.log(tag,userTag)
                        found = true; 
                        break;
                    }
                if (!found) return sendError(403,'Unauthorised, missing required tags', res);
            }
        }
        if (tags.owner) {
            let query = resources[resource].findById(req.params.id);
            query.select('creator')
            let creator = (await query.exec()).creator.toString();
            if (!creator === req.body.user._id) return sendError(403, 'Unauthorised, not creator of resource')
        }
        next();
    }}
}

function sendError(status, error, res) {
    res.status(status).send(error);
}