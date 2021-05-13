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
        required: true, 
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
    Tags: {
        type: Array
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
        required: true,
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

async function createUser(userInfo) {
    if(userInfo.name == undefined || userInfo.password == undefined || userInfo.email == undefined) 
        throw TypeError('You must send user info');

    userInfo.uid = shortid.generate();
    userInfo.billList = [];
    userInfo.cartId = shortid.generate();

    createCart(userInfo.cartId).catch(() => {throw Error('Try again')});

    let user = User(userInfo);
    await user.save();
}

async function createCart(uid) {
    let info = {
        uid: shortid.generate(),
        content: {}
    }
    let cart = Cart(info);
    await cart.save();
}

async function createArticle(articleInfo) {
    articleInfo.uid = shortid.generate();
    if(articleInfo.inStock == undefined) articleInfo.inStock = 0;
    if(articleInfo.price == undefined) articleInfo.price = 0;
    if(articleInfo.tags == undefined) articleInfo.tags = [];
    
    let article = articleSchema(articleInfo);
    await article.save();
}

async function createBill(billInfo) {
    billInfo.uid = shortid.generate();
    if(billInfo.cartId == undefined || billInfo.userId == undefined) throw SyntaxError('You must send cartId nad userId');
    if(billInfo.state == undefined || billInfo.city == undefined || billInfo.direction == undefined
        ||billInfo.cp == undefined || billInfo.internNumber == undefined || billInfo.externNumber == undefined)
        throw TypeError('You must send user info');
    
    let bill = billSchema(billInfo);
    bill.save();

}

async function login(userInfo) {
    const query = User.where({email: userInfo},() => {
        console.log("Simon");
    })
}

exports.createUser = createUser;
exports.login = login;