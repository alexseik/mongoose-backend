/*global require,module,Buffer*/
var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
    ean13 : Number,
    name : String,
    pvp : Number,
    images: [{
        data: String,
        contentType: String
    }],
    typeProduct : String,
    options: [{
        name: String,
        value: mongoose.Schema.Types.Mixed
    }],
    createdAt : Date,
    updatedAt : { type: Date, default: Date.now }
});

ProductSchema.statics.validate = function (product) {
    'use strict';
    return true;
};

module.exports = mongoose.model('product', ProductSchema);
