"use strict";

const mongoose = require('mongoose');
const shortid = require('shortid');
const schema = mongoose.Schema;

let cartSchema = new schema({
    uid:{
        unique: true,
        type: String,
        default: shortid
    },
    content: {
        type: Object,
        default: {}
    }

}, {collection: 'carts'});
let Cart = mongoose.model('cart', cartSchema);

exports.Cart = Cart;