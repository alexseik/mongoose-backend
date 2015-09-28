/*global require,module*/
var express = require('express');
var router = express.Router();

var InvoiceModel = require('../models/invoices.js');


router.get('/', function (req, res, next) {
    'use strict';
    return InvoiceModel.find(function (err, invoices) {
        if (err) {
            next(err);
        }
        return res.json(invoices);
    });
});


router.get('/:id', function (req, res, next) {
    'use strict';
    var id = req.params.id;
    return InvoiceModel.findById(req.params.id, function (err, invoice) {
        if (err) {
            return next(err);
        }
        if (invoice === null) {
            return res.status(404).send({error: 'The invoice does not exist.'});
        }
        return res.json(invoice);
    });
});


router.post('/', function (req, res, next) {
    'use strict';
    var dto = req.body;

    if (dto.customer === undefined || dto.customer === null){
        return res.status(422).send({error: 'The invoice has not a customer.'});
    }

    var invoiceToInsert = new InvoiceModel({
        customer : dto.customer,
        subtotal: dto.subtotal,
        discount: dto.discount,
        total: dto.total,
        invoiceNumber: dto.invoiceNumber,
        createdAt: new Date()
    });

    return InvoiceModel.create(invoiceToInsert, function (err, post) {
        if (err) {
            return next(err);
        }
        return res.json(post);
    });
});


router.put('/:id', function (req, res, next) {
    'use strict';
    var dto = req.body;

    return InvoiceModel.findById(req.params.id, function (err, invoice) {
        var invoiceToInsert = new InvoiceModel({
            customer : dto.customer !== undefined ? dto.customer : invoice.customer,
            subtotal: dto.subtotal !== undefined ? dto.subtotal: invoice.subtotal,
            discount: dto.discount!== undefined ? dto.discount: invoice.discount,
            total: dto.total !== undefined ? dto.total: invoice.total,
            invoiceNumber: dto.invoiceNumber !== undefined ? dto.invoiceNumber : invoice.invoiceNumber
        });
        return InvoiceModel.update(invoiceToInsert, function (err) {
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
    return InvoiceModel.remove({_id: id}, function (err, response) {
        if (err) {
            next(err);
        }
        if (response !== undefined && response.result !== undefined && response.result.n === 0) {
            return res.status(404).send({error: 'The invoice does not exist.'});
        }
        return res.send(301);
    });
});

module.exports = router;