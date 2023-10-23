import { Document, ObjectId, PopulatedDoc } from 'mongoose';

import IUser from './user.interface';

interface IDelivery extends Document {
  _id: ObjectId;
  userId: PopulatedDoc<IUser>;
  productName: string;
  received: boolean;
};



export default IDelivery;