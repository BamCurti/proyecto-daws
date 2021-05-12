"use strict";

let mongoose = require('mongoose');
let shortid = require('shortid');
let mongoConnection = 'mongodb+srv://admin:admin@proyectodaws.7s7sp.mongodb.net/proyectodaws?retryWrites=true&w=majority';

let Schema = mongoose.Schema;

mongoose.connect(mongoConnection, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error'));
db.once('open', () => console.log('DB Connected'));

let userSchema = new Schema({
    name: {
        type: String,
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
    },
    cartId: {
        type: String,
    }
}, {collection: 'users'});
let User = mongoose.model('user', userSchema);

let articleSchema = new Schema({
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
    },
    Tags: {
        type: Array,
    }
}, {collection: 'articles'});
let Article = mongoose.model('article', articleSchema);

let cartSchema = new Schema({
    uid:{
        unique: true,
        type: String,
        default: shortid
    },
    content: {
        type: Object,
    }

}, {collection: 'carts'});
let Cart = mongoose.model('cart', cartSchema);

let billSchema = new Schema({
    uid: {
        unique: true,
        type: String,
        default: shortid
    },
    cartId: {
        unique: true,
        type: String,
        required: true
    },
    userId: {
        unique: true,
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

function createUser(userInfo) {

    if(userInfo.name == undefined || userInfo.password == undefined || userInfo.email == undefined) return 400;

    userInfo.uid = shortid.generate();
    userInfo.billList = [];
    userInfo.cartId = createCart();

    let user = User(userInfo);
    user.save().then(
        function(us) {
            return 200;
        }, function(err) {
            //delete cart
            return 401;
        }
    );
}

function createCart() {
    let info = {
        uid: shortid.generate(),
        content: {}
    }
    let cart = Cart(info);
    cart.save().then((doc)=> console.log(doc));
    return info.uid;
}

function createArticle(articleInfo) {
    articleInfo.uid = shortid.generate();
    
    let article = articleSchema(articleInfo);
    article.save().then((doc)=> console.log(doc));
    return articleInfo.uid;
}

function createBill(billInfo) {
    userSchema.find({uid: billInfo.userId},(err, docs) => {
        console.log(docs);
    })
    
}

exports.createUser = createUser;