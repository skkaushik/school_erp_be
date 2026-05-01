import express from 'express';
import { PORT } from './constants/app.constants.js';
import connectDB from './config/db.js';
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'School ERP Backend is running.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

connectDB();
