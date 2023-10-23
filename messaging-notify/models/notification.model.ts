import mongoose, { Schema, model } from "mongoose";

import INotification from "../interfaces/notification.interface";


const notificationSchema = new Schema<INotification>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true
    }
);


const Notification = model<INotification>('Notification', notificationSchema);



export default Notification;