import { ObjectId } from "mongoose";

interface IUser extends Document{
    _id: ObjectId;
    userName: string;
    email: string;
    password: string;
    isValidPassword?(password: string): Promise<boolean>;

};

export default IUser;