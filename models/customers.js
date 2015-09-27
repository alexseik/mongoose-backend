/*global require,module*/
var mongoose = require('mongoose');

var CustomerSchema = new mongoose.Schema({
    nif: String,
    name: Number,
    options: [{
        name: String,
        value: mongoose.Schema.Types.Mixed
    }],
    phone: Number,
    email: String,
    createdAt : Date,
    updatedAt : { type: Date, default: Date.now }
});

module.exports = mongoose.model('customer', CustomerSchema);
