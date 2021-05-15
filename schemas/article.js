"use strict";

const mongoose = require('mongoose');
const shortid = require('shortid');
const schema = mongoose.Schema;

let articleSchema = new schema({
    uid: {
        required: true,
        unique: true,
        type: String,
        default: shortid
    },
    inStock: {
        type: Number
    },
    price: {
        type: Number
    },
    description: {
        required: true,
        type: String
    },
    tags: {
        type: Array
    },
    image: {
        type: String
    }
}, {collection: 'articles'});
let Article = mongoose.model('article', articleSchema);

exports.Article = Article;