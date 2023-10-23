import { Document, ObjectId, PopulatedDoc } from 'mongoose';

import IUser from './user.interface';

interface INotification extends Document {
    _id: ObjectId;
    userId: PopulatedDoc<IUser>;
    message: string;
    read: boolean;
};



export default INotification;