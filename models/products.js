/*global require,module*/
var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
    ean13 : Number,
    name : String,
    pvp : Number,
    images: [],
    typeProduct : String,
    createdAt : Date,
    updatedAt : { type: Date, default: Date.now },
    productImages : []
});

module.exports = mongoose.model('Product', ProductSchema);
