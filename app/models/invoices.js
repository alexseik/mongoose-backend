/*global require, module*/
var mongoose = require('mongoose');
require('./customers');
var InvoidSchema = new mongoose.Schema({
    customer : {type : mongoose.Schema.ObjectId, ref : 'customer'},
    subtotal: Number,
    discount: Number,
    total: Number,
    invoiceNumber: String,
    createdAt : Date,
    status:{
        type: String,
        default:'ORDERED',
        enum: ['ORDERED','CANCELED','FINISH']
    }, //TODO put constants
    updatedAt : { type: Date, default: Date.now }
});

module.exports = mongoose.model('invoid', InvoidSchema);
