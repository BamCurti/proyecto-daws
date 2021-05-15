"use strict";

const mongoose = require('mongoose');
const schema = mongoose.Schema;
const shortid = require('shortid');

let userSchema = new schema({
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

let User = mongoose.model('User', userSchema);

exports.User = User;