"use strict";

const express = require('express');
const router = require('./services/router.js');
const app = express();
const cors = require('cors');
const config = require('./config.js');

app.use(express.json());
app.use(cors());
app.use(router);

app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/Home.html");
})


app.listen(config.port, function() {
    console.log(`Example app listening on port ${config.port}!`);
});