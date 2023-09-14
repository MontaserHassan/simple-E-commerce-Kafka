import { ObjectId } from "mongoose";


enum Role {
    ADMIN = 'admin',
    USER = 'user',
}

interface IUser extends Document{
    _id: ObjectId;
    userName: string;
    email: string;
    password: string;
    isValidPassword?(password: string): Promise<boolean>;
    role: Role;
};

export {
    Role,
    IUser
};