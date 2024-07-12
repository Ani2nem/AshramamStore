import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';


import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import connectDB from "./config/db.js";
import errorMiddleware from './middlewares/errorMiddleware.js';

dotenv.config();
const port = process.env.PORT || 5001;
connectDB();

const app = express();
/*
import cors from 'cors';
app.use(cors());

app.use(cors({
  origin: 'https://anirudh-e-store-frontend.onrender.com',
  credentials: true,
}));

*/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/users', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/config/paypal', (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(errorMiddleware);


app.listen(port, () => console.log(`Server is running on port: ${port}`));
