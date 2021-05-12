"use strict";

let mongo = require('mongoose');
let shortid = require('shortid');
let bcrypt = require('bcrypt');
let mongoConnection = 'mongodb+srv://admin:admin@proyectodaws.7s7sp.mongodb.net/test';

mongo.connect(mongoConnection, {useNewUrlParser: true});
const db = mongo.connection;
db.on('error', console.error.bind(console, 'Connection error'));
db.once('open', () => console.log('DB Connected'));

let userSchema = new mongo.Schema({
    name: {
        type: String,
        lowercase: true,
        required: true
    },
    uid: {
        unique: true,
        type: String,
        default: shortid
    },
    email: {
        unique: true,
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    billList: {
        type: Array,
        required: true
    },
    cartId: {
        type: String,
        required: true
    }
});

let articleSchema = mongo.Schema({
    uid: {
        unique: true,
        type: String,
        default: shortid
    },
    inStock: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    Tags: {
        type: Array,
        required: true
    }
});

let cartSchema = mongo.Schema({
    uid:{
        unique: true,
        type: Number,
        default: shortid
    },
    content: {
        type: Object,
        required: true
    }
});

let billSchema = mongo.Schema({
    uid: {
        unique: true,
        type: String,
        default: shortid
    },
    cartId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    direction: {
        type: String,
        required: true
    },
    cp: {
        type: Number,
        required: true
    },
    internNumber: {
        type: String,
        required: true
    },
    externNumber: {
        type: String,
        required: true
    }

});


module.exports = userSchema;
module.exports = articleSchema;
module.exports = cartSchema;
module.exports = billSchema;