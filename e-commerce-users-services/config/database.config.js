const mongoose = require('mongoose');

const { startingApp } = require('./startingApp.config');


const connectDB = (app) => {
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('Connected to users Database successfully');
        startingApp(app);
    }
    ).catch((err) => console.log("Error connecting to users database:", err));
};



module.exports = {
    connectDB,
};