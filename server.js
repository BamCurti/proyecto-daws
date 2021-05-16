"use strict";

const express = require('express');
const router = require('./services/router.js');
const app = express();
const cors = require('cors');
const config = require('./config.js');

app.use(cors({origin: ['http://127.0.0.1:5000']}));

app.use(express.json());

app.use(router);

app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/Home.html");
})


app.listen(config.port, function() {
    console.log(`Example app listening on port ${port}!`);
});