import { Document, PopulatedDoc } from 'mongoose';
import IUser from './user.interface';

interface INotification extends Document {
    userId: PopulatedDoc<IUser>;
    message: string;
    read: boolean;
}

export default INotification;