import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/userRoutes.js'
import connectDB from "./config/db.js";
import errorMiddleware from './middlewares/errorMiddleware.js';

dotenv.config();
const port = process.env.PORT || 5001;
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extened: true}));
app.use(cookieParser());

app.use("/api/users", userRoutes);


// handle errors in middleware
app.use(errorMiddleware);


app.listen(port, () => console.log(`Server is running on port: ${port}`));