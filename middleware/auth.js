const jwt = require('jsonwebtoken')
const {User} = require('../models/user')
const config = require('config');

module.exports = function auth(isRefresh) {
    return async function(req, res, next) {
        let token
        if (isRefresh) {
            if (req.cookies['x-refresh-token']) {
                token = req.cookies['x-refresh-token'];
            }
            else return res.status(401).send('Access denied. No token provided')
        } 
        else {
            if (req.header('x-access-token')){
                token = req.header('x-access-token');
            }
            else return res.status(401).send('Access denied. No token provided')
        }


        try {
            const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
            // if we are authenticating a refresh token, make sure they didnt send a valid access token
            if (decoded.isAccess && isRefresh) return res.status(400).send('Invalid token, wrong token')
            // ensure the ip of client that created token is ip of current client
            if (decoded.ip !== req.ip) return res.status(400).send('Invalid token, cs')
            const user = await User.findById(decoded.uid)
            // ensure the uid in token is valid
            if (!user) return res.status(400).send('no user found');
            const userToken = await user.getToken(decoded._id)
            // ensure that user has this token (or token parent if access token) in token list
            if (!userToken) return res.status(400).send('Invalid token, missing');
            // ensure token (or token parent) is valid
            if (!userToken.isValid) return res.status(400).send('Invalid token, invalid');
            const now = new Date();
            const secondsSinceEpoch = Math.round(now.getTime() / 1000);
            const secondsSinceTokenEpoch = secondsSinceEpoch - decoded.iat;
            // ensure token is still in date, 1 hour for access, 7 days for refresh
            if (secondsSinceTokenEpoch > (decoded.isAccess ? 3600 : 604800)) return res.status(400).send('Token Expired');
            req.body.user = user;
            req.body.token = decoded;
            next();
        } catch (ex) {
            console.log(ex)
            return res.status(400).send('Invalid token');
        }

    }
}