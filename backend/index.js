import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

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

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/config/paypal', (req, res) => {
    res.send({clientId: process.env.PAYPAL_CLIENT_ID});
});

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// handle errors in middleware
app.use(errorMiddleware);


app.use(cors({
    origin: 'https://anirudh-e-store-frontend.onrender.com',
    credentials: true,
}));


// error handling
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
  });

  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
  });





app.listen(port, () => console.log(`Server is running on port: ${port}`));