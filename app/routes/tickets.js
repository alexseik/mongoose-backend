/*global require,module*/
var express = require('express');
var router = express.Router();



var TicketModel = require('../models/tickets.js');

router.get('/', function (req, res, next) {
    'use strict';
    return TicketModel.find(function (err, tickets) {
        if (err) {
            next(err);
        }
        return res.json(tickets);
    });
});

router.get('/:id', function (req, res, next) {
    'use strict';
    var id = req.params.id;
    return TicketModel.findById(req.params.id, function (err, ticket) {
        if (err) {
            return next(err);
        }
        if (ticket === null) {
            return res.status(404).send({error: 'The ticket does not exist.'});
        }
        return res.json(ticket);
    });
});

router.post('/', function (req, res, next) {
    'use strict';
    var dto = req.body;

    if (dto.rows === undefined || dto.rows.length === 0) {
        return res.status(422).send({error: 'The ticket does not contain rows.'});
    }

    var subtotal = 0,
        discount = 0,
        total = 0;
    for (var idx in dto.rows) {
        if (dto.rows[idx].unitPrice !== undefined &&
            dto.rows[idx].discountPercentage !== undefined &&
            dto.rows[idx].quantity !== undefined) {
            var lineTotal = dto.rows[idx].unitPrice * dto.rows[idx].quantity;
            subtotal = subtotal + lineTotal;
            discount = discount + lineTotal * dto.rows[idx].discountPercentage;
        } else {
            return res.status(422).send({error: 'The ticket lines has malformed amounts.'});
        }
    }

    total = subtotal - discount;

    var ticketToInsert = new TicketModel({
        invoice: dto.invoice === undefined ? null : dto.invoice,
        rows: dto.rows,
        subtotal: subtotal,
        discount: discount,
        total: total,
        createdAt: new Date()
    });

    return TicketModel.create(ticketToInsert, function (err, post) {
        if (err) {
            return next(err);
        }
        return res.json(post);
    });
});

router.put('/:id', function (req, res, next) {
    'use strict';
    var dto = req.body;

    return TicketModel.findById(req.params.id, function (err, ticket) {
        if (err) {
            next(err);
        }
        if (dto.invoice !== undefined && ticket.invoice !== dto.invoice) {
            ticket.invoice = dto.invoice;
        }
        if (dto.rows !== undefined && dto.rows.length > 0) {
            var subtotal = 0,
                discount = 0,
                total = 0;
            for (var idx in dto.rows) {
                if (dto.rows[idx].unitPrice !== undefined &&
                    dto.rows[idx].discountPercentage !== undefined &&
                    dto.rows[idx].quantity !== undefined) {
                    var lineTotal = dto.rows[idx].unitPrice * dto.rows[idx].quantity;
                    subtotal = subtotal + lineTotal;
                    discount = discount + lineTotal * dto.rows[idx].discountPercentage;
                } else {
                    return res.status(422).send({error: 'The ticket lines has malformed amounts.'});
                }
            }

            total = subtotal - discount;

            ticket.rows = dto.rows;
            ticket.subtotal = subtotal;
            ticket.discount = discount;
            ticket.total = total;
        }
        return TicketModel.update(ticket, function (err) {
            if (err) {
                return res.status(404).send({error: 'The product does not exist.'});
            }
            return res.send(200);
        });
    });
});

router.delete('/:id', function (req, res, next) {
    'use strict';
    var id = req.params.id;
    return TicketModel.remove({_id: id}, function (err, response) {
        if (err) {
            next(err);
        }
        if (response !== undefined && response.result !== undefined && response.result.n === 0) {
            return res.status(404).send({error: 'The ticket does not exist.'});
        }
        return res.send(301);
    });
});

module.exports = router;
