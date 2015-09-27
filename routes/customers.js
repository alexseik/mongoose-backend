/*global require,module*/
var express = require('express');
var router = express.Router();

var CustomerModel = require('../models/customers.js');


router.get('/', function (req, res, next) {
    'use strict';
    return CustomerModel.find(function (err, customers) {
        if (err) {
            next(err);
        }
        return res.json(customers);
    });
});


router.get('/:id', function (req, res, next) {
    'use strict';
    var id = req.params.id;
    return CustomerModel.findById(req.params.id, function (err, customer) {
        if (err) {
            return next(err);
        }
        if (customer === null) {
            return res.status(404).send({error: 'The customer does not exist.'});
        }
        return res.json(customer);
    });
});


router.post('/', function (req, res, next) {
    'use strict';
    var dto = req.body;

    if (dto === undefined || dto === {}) {
        return res.status(422).send({error: 'The customer does not contain data.'});
    }

    var customerToInsert = new CustomerModel({
        nif: dto.nif,
        name: dto.name,
        options: dto.options,
        phone: dto.phone,
        email: dto.email,
        createdAt: new Date()
    });

    return CustomerModel.create(customerToInsert, function (err, post) {
        if (err) {
            return next(err);
        }
        return res.json(post);
    });
});


router.put('/:id', function (req, res, next) {
    'use strict';
    var dto = req.body;

    if (dto === undefined || dto === {}) {
        return res.status(422).send({error: 'The customer does not contain data.'});
    }

    return CustomerModel.findById(req.params.id, function (err, customer) {
        var customerToInsert = new CustomerModel({
            nif: dto.nif !== undefined ? dto.nif : customer.nif,
            name: dto.name !== undefined ? dto.name : customer.name,
            options: dto.options !== undefined ? dto.options : customer.otpions,
            phone: dto.phone !== undefined ? dto.phone : customer.phone,
            email: dto.email !== undefined ? dto.email : customer.email
        });
        return CustomerModel.update(customerToInsert, function (err) {
            if (err) {
                return next(err);
            }
            return res.send(200);
        });
    });
});

router.delete('/:id', function (req, res, next) {
    'use strict';
    var id = req.params.id;
    return CustomerModel.remove({_id: id}, function (err, response) {
        if (err) {
            next(err);
        }
        if (response !== undefined && response.result !== undefined && response.result.n === 0) {
            return res.status(404).send({error: 'The customer does not exist.'});
        }
        return res.send(301);
    });
});

module.exports = router;