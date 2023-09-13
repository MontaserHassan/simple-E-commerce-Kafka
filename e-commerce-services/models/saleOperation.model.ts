import mongoose, { Schema, model } from "mongoose";

import ISaleOperation from "../interfaces/saleOperation.interface";


const saleOperationSchema = new Schema<ISaleOperation>(
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



export default  model<ISaleOperation>('SaleOperation', saleOperationSchema);


