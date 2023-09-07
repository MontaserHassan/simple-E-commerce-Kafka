const { Product } = require('../models/product.model');
const { publishUserEvent } = require('../utils/publish-event.util');


// --------------------------------------------- create product ---------------------------------------------


const createProduct = async (req, res) => {
    console.log("create product");
};


// --------------------------------------------- sell product ---------------------------------------------


const buyProduct = async (req, res) => {
    console.log("sell product");
};


// --------------------------------------------- refund product ---------------------------------------------


const refundProduct = async (req, res) => {
    console.log("refund product");
};


// --------------------------------------------- get all product ---------------------------------------------


const getProducts = async (req, res) => {
    console.log("all product");
};



module.exports = {
    createProduct,
    buyProduct,
    refundProduct,
    getProducts,
};