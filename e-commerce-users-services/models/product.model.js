const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true
    },
});


const Product = mongoose.model('Product', productSchema);



module.exports = {
    Product
};