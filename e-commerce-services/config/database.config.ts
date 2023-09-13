const mongoose = require('mongoose');
import { Application } from 'express'

const { startingApp } = require('./startingApp.config');

import { config } from 'dotenv';
config();

const { DATABASE_URL } = process.env;

const connectDB = (app:Application) => {
    mongoose.connect(DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('Connected to Database successfully');
        startingApp(app);
    }
    ).catch((err:Error) => console.log("Error connecting to database:", err));
};



module.exports = {
    connectDB,
};
