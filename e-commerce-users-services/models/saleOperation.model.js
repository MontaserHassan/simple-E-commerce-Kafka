const mongoose = require('mongoose');


const saleOperationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true
  }
);


const SaleOperation = mongoose.model('SaleOperation', saleOperationSchema);


module.exports = {
  SaleOperation
};