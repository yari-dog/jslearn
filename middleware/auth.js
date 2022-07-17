const jwt = require('jsonwebtoken')
const {User} = require('../models/user')
const config = require('config');

module.exports = function auth(isRefresh) {
    return async function(req, res, next) {
        let token
        let cookie
        if (isRefresh) {
            cookie = 'x-refresh-token'
        } else {
            cookie = 'x-access-token'
        }
        if (req.cookies[cookie]){
            token =req.cookies[cookie];
        } else return sendError(cookie,401,'Access denied, no token', res);

        try {
            const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
            // if we are authenticating a refresh token, make sure they didnt send a valid access token
            if (decoded.isAccess && isRefresh) return sendError(cookie,400,'Invalid token, wrong token', res);
            // ensure the ip of client that created token is ip of current client
            if (decoded.ip !== req.ip) return sendError(cookie,401,'Access denied: Token from alternate IP', res);
            const user = await User.findById(decoded.uid)
            // ensure the uid in token is valid
            if (!user) return sendError(cookie,400,'Invalid token, missing user (how?)', res);
            const userToken = await user.getToken(decoded._id)
            // ensure that user has this token (or token parent if access token) in token list
            if (!userToken) return sendError(cookie,401,'Access denied, token missing from user', res);
            // ensure token (or token parent) is valid
            if (!userToken.isValid) return sendError(cookie,401,'Access denied: token is invalid', res);
            const now = new Date();
            const secondsSinceEpoch = Math.round(now.getTime() / 1000);
            const secondsSinceTokenEpoch = secondsSinceEpoch - decoded.iat;
            // ensure token is still in date, 1 hour for access, 7 days for refresh
            if (secondsSinceTokenEpoch > (decoded.isAccess ? 3600 : 604800)) return sendError(cookie,401,'Access denied: token is expired',res);
            req.body.user = user;
            req.body.token = decoded;
            next();
        } catch (ex) {
            console.log(ex)
            return sendError(cookie,400,'Invalid token, misc', res);
        }

    }
}

function sendError(cookie, status, error, res) {
    res.clearCookie(cookie);
    res.status(status).send(error);
}