"use strict";

const router = require('express').Router();
const mongoose = require('mongoose');
const shortid = require('shortid');
const auth = require('./auth.js');
const config = require('../config.js');

const User = require('../schemas/user.js').User;
const Article = require('../schemas/article.js').Article;
const Bill = require('../schemas/bill.js').Bill;
const Cart = require('../schemas/cart.js').Cart;
const { query } = require('express');


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
                res.status(403).send('Error en la base de datos');
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

router.route('/api/users/:email')
    .get(auth.isAuth, (req, res) => {
        let reqEmail = req.params.email;
        console.log(reqEmail);

        const query = User.where({email: reqEmail});

        query.findOne((err, doc) => {
            if(err) return res.status(500).send('La base de datos ha fallado');
            if(doc == null) return res.status(404).send('El correo no está en la base de datos');

            res.set('Content-Type', 'application/json');
            res.set('X-Auth', req.headers['x-auth']);
            res.status(200).send(JSON.stringify(doc));
        })

    });

router.route('/api/articles')
    .get((req, res) => {
        const query = Article.find((err, doc) => {
            if(err) return res.status(500).send('La base de datos ha fallado');

            res.set('Content-Type', 'application/json');
            res.status(200).send(JSON.stringify(doc));
        });
    }).post(auth.isAdmin, (req, res) => {
        let info = req.body;

        console.log(info);
        if(info.price == undefined || info.description == undefined)
            return res.status(403).send('Falta información obligatoria');

        info.uid = shortid.generate();

        if(info.inStock == undefined) info.inStock = 0;
        if(info.tags == undefined) info.tags = [];
        if(info.image == undefined) info.image = '';
        
        const article = new Article(info);
        article.save((err, articleStored) => {
            if(err)
                return res.status(500).send("Error en la base de datos");
            
            console.log(articleStored);
            res.set('Content-Type', 'application/json');
            res.status(201).send('Articulo creado');
        });
    });

router.route('/api/articles/:id')
    .put(auth.isAdmin, (req, res) => {
        const articleId = req.params.id;
        const info = req.body;

        Article.findOneAndUpdate({uid: articleId}, info, (errArticle, docArticle) => {
            if(errArticle) return res.status(403).send("Cambio invalido");

            res.set('Content-Type', 'application/json');
            res.set('X-Auth', auth.createToken(info));
            res.status(200).send(JSON.stringify(docArticle));
            
        })

    });

router.route('/api/cart/:id')
    .get(auth.isAuth, (req, res) => {
        //query de id
        const queryUser = User.where({uid: req.params.id});
        queryUser.findOne((err, doc) => {
            //si doc == null, res = 404
            if(err) return res.status(500).send('Error en el servidor');
            if(doc == null) return res.status(404).send("Usuario no encontrado");

            //query con el id de carrito
            const cartId = doc.cartId;
            const queryCart = Cart.where({uid: cartId});
            queryCart.findOne((err, doc) => {
                if(err) return res.status(500).send('Error en el servidor');
                //devolver query por json y estado 200

                res.set('Content-Type', 'application/json');
                res.set('X-Auth', req.headers['x-auth']);
                return res.status(200).send(JSON.stringify(doc));

            })


        });

    })
    .put(auth.isAuth, (req, res) => {
        const queryUser = User.where({uid: req.params.id});
        queryUser.findOne((err, doc) => {
            if(err) return res.status(500).send('Error en el servidor buscando al usuario');
            if(doc == null) return res.status(404).send("Usuario no encontrado");

            const cartId = doc.cartId;
            const newContent = req.body.content;

            console.log(cartId);

            Cart.findOneAndUpdate({uid: cartId}, {content: newContent}, (errCart, doc) => {
                if(errCart){ 
                    return res.status(500).send('Error en el servidor al carrito');
                }                
                res.set('Content-Type', 'application/json');
                res.set('X-Auth', req.headers['x-auth']);
                return res.status(200).send(JSON.stringify(doc));
            });
        });
    });

router.route('/api/bills/:idUser')
    .get(auth.isAuth, (req, res) => {
        const idUser = req.params.idUser;
        const queryUser = User.where({uid: idUser});

        queryUser.findOne((errUser, docUser) => {
            if(errUser) return res.status(500).send("Error en la base de datos");
            if(docUser == null) return res.status(404).send("Usuario no encontrado");

            const bills = docUser.billList;

            res.set('Content-Type', 'application/json');
            res.set('X-Auth', req.headers['x-auth']);           

            return res.status(200).send(JSON.stringify(bills));
        })
    })
    .post(auth.isAuth, (req, res) => {
        const userId = req.params.idUser;
        const info = req.body;

        //verificar información

        if(info.state == undefined ||
            info.city == undefined || info.direction == undefined ||
            info.cp == undefined || info.internNumber == undefined||
            info.externNumber == undefined)
            return res.status(403).send("Datos obligatorios no definidos");

        const userQuery = User.where({uid: userId});
        
        //Buscar usuario para guardar todo
        
        userQuery.findOne((errUser, docUser) => {
            if(errUser) return res.status(500).send("Error en la base de datos USUARIOS");
            if(docUser == null) return res.status(404).send("Usuario no encontrado");

            //Subir factura
            info.uid = shortid.generate();
            info.userId = userId;
            info.cartId = docUser.cartId;

            const newBill = Bill(info);
            newBill.save((errBill, docBill) => {
                if(errBill) {
                    console.log(errBill);
                    return res.status(500).send("Error al guardar la factura");
                }

                //Actualizar usuario
                docUser.billList.push(info.uid);
                docUser.cartId = shortid.generate();

                let cart = new Cart({uid: docUser.cartId, content: {}});

                cart.save((errCart, cartStored) => {
                    if(errCart) return res.status(500).send("Error al crear nuevo carrito");
                    
                    User.findOneAndUpdate({uid: userId}, docUser, (errUpdate, docUpdate) => {
                        if(errUpdate){ 
                            return res.status(500).send("Error en la base de datos USUARIOS UPDATE");
                        }
    
                        res.set('Content-Type', 'application/json');
                        res.set('X-Auth', req.headers['x-auth']);           
            
                        return res.status(200).send(JSON.stringify(docBill));
    
                    });

                })
            })

        } )
        

    });

router.route('/api/bills/bill/:id')
    .get(auth.isAuth, (req, res) => {
        const idBill = req.params.id;
        const queryBill = Bill.where({uid: idBill});

        queryBill.findOne((err, docBill) => {
            if(err) return res.status(500).send('Error en el servidor');
            if(docBill == null) return res.status(404).send('La factura no existe');

            res.set('Content-Type', 'application/json');
            res.set('X-Auth', req.headers['x-auth']);
            return res.status(200).send(JSON.stringify(docBill));
        })
    });

module.exports = router;