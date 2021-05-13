"use strict";

const router = require('express').Router();
const dataHandler = require("./data_handler.js");

router.route('/').get((req, res) => {
    res.set('Content-type', 'application/json;charset=utf-8')
    res.send("Hello world");
});

router.route('/api/login')
    .post((req, res) => {
        let user = req.body;
        dataHandler.login(user).then(() => {
            res.statusCode = 200;
            res.set('Content-Type', 'application/json; charset=utf-8');
            res.send('Login exitoso');
        }).catch(() => res.status(401).send('Login invalido'));

    });

router.route('/api/users')
    .post((req, res) => {
        let user = req.body;
        dataHandler.createUser(user).then(() => {
            res.statusCode = 201;
            res.set('Content-Type', 'application/json; charset=utf-8');
            res.send('Usuario creado');
        }).catch (() => res.status(403).send("Sorry, that can't happen"));
    });

module.exports = router;