/*global require,module*/
var mongoose = require('mongoose');
require('./products.js');
require('./invoices.js');

var TicketRowSchema = new mongoose.Schema({
    product: {type: mongoose.Schema.ObjectId, ref: 'product'},
    productEan13: Number,
    productName: String,
    description: String,
    unitPrice: Number,
    discountPercentage: Number,
    quantity: Number
});

var TicketSchema = new mongoose.Schema({
    invoice: {type: mongoose.Schema.ObjectId, ref: 'invoice'},
    rows: [TicketRowSchema],
    subtotal: Number,
    discount: Number,
    total: Number,
    ticketNumber: String,
    createdAt: Date,
    updatedAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('ticket', TicketSchema);
