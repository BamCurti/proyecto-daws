"use strict";

const mongoose = require('mongoose');
const shortid = require('shortid');
const schema = mongoose.Schema;

let billSchema = new schema({
    uid: {
        required: true,
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

}, {collection: 'bills'});
let Bill = mongoose.model('bill', billSchema);

exports.Bill = Bill;