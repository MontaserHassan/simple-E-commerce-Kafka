import { Document, PopulatedDoc } from 'mongoose';
import IUser from './user.interface';

interface IDelivery extends Document {
  userId: PopulatedDoc<IUser>;
  productName: string;
  received: boolean;
}

export default IDelivery;