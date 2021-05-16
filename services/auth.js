"use strict";
const jwt = require('jwt-simple');
const moment = require('moment');
const config = require('../config.js');

const adminPayload = {
    EVC: "is725762",
    ENV: "is715155"
}

const adminToken = jwt.encode(adminPayload, config.SECRET_TOKEN);

function createToken(user) {
    const payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(1, 'days').unix()
    }

    return jwt.encode(payload, config.SECRET_TOKEN);
}

function isAuth(req, res, next) {
    if(!req.headers['x-auth']){
        return res.status(403).send('No tienes autorización');
    }
    const token = req.headers['x-auth'];

    let payload;
    try {
        payload = jwt.decode(token, config.SECRET_TOKEN);        
    } catch (error) {
        return res.status(403).send('Token erroneo');
    }

    if(payload.exp < moment().unix())
        return res.status(401).send("El token ha expirado");

    req.user = payload.sub;
    next();
}

function isAdmin(req, res, next) {
    console.log("\n" + adminToken + "\n")
    if(!req.headers['x-admin']) 
    return res.status(403).send('No tienes autorización');
    
const token = req.headers['x-admin'];
let payload;

try {
    payload = jwt.decode(token, config.SECRET_TOKEN);
} catch (error) {
    return res.status(403).send("Token erroneo");
}

if(payload.ENV == undefined || payload.EVC == undefined)
    return res.status(403).send('No tienes autorización');

console.log("Admin authorized");
next();
}

exports.createToken = createToken;
exports.isAuth = isAuth;
exports.isAdmin = isAdmin;
