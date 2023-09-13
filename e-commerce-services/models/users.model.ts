import { Schema, model } from "mongoose";

import IUser from "../interfaces/user.interface";

const bcrypt = require('bcrypt');

const userSchema = new Schema<IUser>(
    {
        userName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(docs, ret) {
                delete ret.password;
            }
        }
    }
);


userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.isValidPassword = async function (password:String) : Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};



export default model<IUser>("User", userSchema)

