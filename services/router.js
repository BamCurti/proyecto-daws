"use strict";

const router = require('express').Router();
const mongoose = require('mongoose');
const shortid = require('shortid');
const auth = require('./auth.js');
const config = require('../config.js');

const User = require('../schemas/user.js').User;
const Article = require('../schemas/article.js').Article;
const Bill = require('../schemas/Bill.js').Bill;
const Cart = require('../schemas/cart.js').Cart;


mongoose.connect(config.db, {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error'));
db.once('open', () => console.log('DB Connected'));

router.route('/api/users')
    .post((req, res) => {
        let info = req.body;
        console.log(info);
        if(info.name == undefined || info.email == undefined || info.password == undefined){
            res.status(400).send('Dato necesario no definido');
            return;
        }

        info.uid = shortid.generate();
        info.billList = [];
        info.cartId = shortid.generate();

        //crear carrito para usuario
        let cartInfo = {
            uid: info.cartId,
            content: {}
        }

        let cart = new Cart(cartInfo);
        cart.save((err, cartStored) => {
            if(err) {
                res.status(500).send("Error en la base de datos");
                return;
            }
        });

        let user = new User(info);
       
        user.save((err, userStored) => {
            if(err) {
                res.status(401).send('Error en la base de datos');
                return;
            }
            res.set('Content-Type', 'application/json');
            res.status(201).send('Usuario creado');
        })
    });

router.route('/api/login')
    .post((req, res) => {
        let info = req.body;
        if(info.password == undefined || info.email == undefined) {
            res.status(400).send('Falta contraseña o email');
            return;
        }

        const query = User.where({email: info.email});

        query.findOne((err, doc) => {
            if(err) {
                res.status(404).send('El usuario no existe');
                return;
            }

            if(doc == null) {
                res.status(404).send('El usuario no existe');
                return;                
            }

            if(doc.password != info.password) {
                res.status(401).send('La contraseña es erronea');
                return;
            }

            res.set('Content-Type', 'application/json');
            res.set('X-Auth', auth.createToken(info));
            res.status(200).send('Login exitoso');
        })
    });


module.exports = router;