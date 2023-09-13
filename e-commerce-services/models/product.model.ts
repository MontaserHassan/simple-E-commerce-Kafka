import { Schema,model } from "mongoose";
import IProduct from "../interfaces/product.interface";

const productSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
        },
        color: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
);


const Product = model<IProduct>('Product', productSchema);



module.exports = {
    Product
};