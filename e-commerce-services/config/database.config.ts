import mongoose from 'mongoose';
import { Application } from 'express'
import startingApp from './startingApp.config';


const { DATABASE_URL } = process.env;

const connectDB = (app: Application) => {
    mongoose.connect(DATABASE_URL).then(() => {
        console.log('Connected to Database successfully');
        startingApp(app);
    }
    ).catch((err: Error) => console.log("Error connecting to database:", err));
};



export default connectDB;