import express from 'express';
import { config } from 'dotenv';

config();
import connectDB from './config/database.config';
import parseFormData from './middlewares/parse-form-data.middleware';
import router from './routes/index.routes';
// import '../messaging/consumer/indexConsumer';


const app = express();

app.use(express.json());
app.use(parseFormData);

app.use(router);

connectDB(app);