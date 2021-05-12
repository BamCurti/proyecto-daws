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

        res.statusCode = dataHandler.createUser(user);
        res.set('Content-Type', 'application/json; charset=utf-8');
        if(res.statusCode == 200) res.send('Login exitoso');
        else res.status(401).send("Sorry, that can't happen")

    });


module.exports = router;