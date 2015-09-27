/*global require,module*/
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/products');
var ProductModel = require('../models/products.js');

router.get('/', function (req, res, next) {
    'use strict';
    return ProductModel.find(function (err, products) {
        if (err) {
            return next(err);
        }
        return res.json(products);
    });
});

router.get('/:id', function (req, res, next) {
    'use strict';
    if (req.params === undefined || req.params.id === undefined) {
        return res.status(422).send({error: 'The product does not contain data.'});
    }
    return ProductModel.findById(req.params.id, function (err, product) {
        if (err) {
            return next(err);
        }
        if (product === null){
            return res.status(404).send({error: 'The product does not exist.'});
        }
        return res.json(product);
    });
});

router.post('/', function (req, res, next) {
    'use strict';
    var dto = req.body;

    if (dto.product === undefined ){
        return res.status(422).send({error:'The product does not contain data.'});
    }

    if (dto.images !== undefined){
        if (dto.images instanceof Array){
            dto.product.images = [];
            for (var idx in dto.images){
                if (dto.product.images !== undefined){
                    var imgBuffer = dto.images[idx];
                    var image = {'data':imgBuffer,'contentType':'img/png'};
                    dto.product.images.push(image);
                }
            }
        }
    }

    var productToInsert = new ProductModel({
        ean13 : dto.product.ean13,
        name : dto.product.name,
        pvp : dto.product.pvp,
        images: dto.product.images,
        typeProduct : dto.product.typeProduct,
        createdAt :  new Date()
    });

    if (!ProductModel.validate(productToInsert)){
        return res.status(422).send({error:'The product is malformed.'});
    }

    return ProductModel.create(productToInsert, function (err, post) {
        if (err) {
            return next(err);
        }
        return res.json(post);
    });
});

router.put('/:id',function(req,res){
   'use strict';
    var id = req.params.id;
    var dto = req.body;
    //TODO also update image
    return ProductModel.update(dto.product,function(err){
        if (err){
            return res.status(404).send({error: 'The product does not exist.'});
        }
        return res.send(200);
    });
});

router.delete('/:id',function(req,res,next){
    'use strict';
    var id = req.params.id;
    return ProductModel.remove({_id:id},function(err,response){
        if (err){
            next(err);
        }
        if (response !== undefined && response.result !== undefined && response.result.n === 0){
            return res.status(404).send({error: 'The product does not exist.'});
        }
        return res.send(301);
    });
});

module.exports = router;