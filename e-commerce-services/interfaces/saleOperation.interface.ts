import mongoose, { Document, PopulatedDoc } from 'mongoose';
import IUser from './user.interface';
import IProduct from './product.interface';

interface ISaleOperation extends Document {
    user: PopulatedDoc<IUser>;
    product: PopulatedDoc<IProduct>;
    quantity: number;
    purchaseDate: Date;
}

export default ISaleOperation;