/*global require,module*/
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/products');
var ProductModel = require('../models/products.js');

router.post('/', function (req, res, next) {
    'use strict';
    var dto = req.body;

    if (dto.product === undefined ){
        return res.status(422).send({error:'The product does not contain data.'});
    }

    var productToInsert = new ProductModel({
        ean13 : dto.product.ean13,
        name : dto.product.name,
        pvp : dto.product.pvp,
        images: dto.product.images,
        typeProduct : dto.product.typeProduct,
        createdAt :  new Date(),
        productImages : dto.product.productImages
    });

    return ProductModel.create(productToInsert, function (err, post) {
        if (err) {
            return next(err);
        }
        return res.json(post);
    });
});

module.exports = router;