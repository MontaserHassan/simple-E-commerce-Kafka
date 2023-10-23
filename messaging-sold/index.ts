import express from 'express';
import { config } from 'dotenv';

config();
import connectDB from './config/database.config';
import './consumer/indexConsumer';


const app = express();


connectDB(app);