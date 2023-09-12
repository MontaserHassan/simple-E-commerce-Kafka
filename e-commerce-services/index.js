const express = require('express');
require('dotenv').config();

const { connectDB } = require('./config/database.config');
const router = require('./routes/index.routes');
const { parseFormData } = require('./middlewares/parse-form-data.middleware');


const app = express();

app.use(express.json());
app.use(parseFormData);

app.use(router);

connectDB(app);