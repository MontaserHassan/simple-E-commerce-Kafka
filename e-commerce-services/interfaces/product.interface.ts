import { ObjectId } from "mongoose";

interface IProduct extends Document {
    _id: ObjectId;
    name: string;
    category: string;
    description: string;
    price: number;
    stock: number;
    color: string;
};



export default IProduct;