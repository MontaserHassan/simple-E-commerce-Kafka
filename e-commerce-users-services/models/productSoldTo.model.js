const mongoose = require('mongoose');

const productSoldToSchema = new mongoose.Schema({
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
},{
    timestamps: true
});

module.exports = mongoose.model('ProductSoldTo', productSoldToSchema);