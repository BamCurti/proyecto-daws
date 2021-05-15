"use strict";
const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../config.js');

function createToken(user) {
    const payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(1, 'days').unix()
    }

    return jwt.encode(payload, config.SECRET_TOKEN);
}

function isAuth(req, res, next) {
    if(!req.headers['X-Auth']) 
        return res.status(403).send('No tienes autorización');
    
    const token = req.headers['X-Auth'].split(" ")[1];
    const payload = jwt.decode(token, config.SECRET_TOKEN);

    if(payload.exp < moment().unix())
        return res.status(401).send("El token ha expirado");

    req.user = payload.sub;
    next();
}

exports.createToken = createToken;
exports.isAuth = isAuth;
