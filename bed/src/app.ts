import { json } from 'body-parser';
import express, { Request, Response, NextFunction } from 'express';
import cartRoutes from './routes/cartRoutes';
import ordersRoutes from './routes/ordersRoutes';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';
import cors from 'cors';

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();

app.use(json());

app.use(cors(corsOptions));

app.use('/', cartRoutes);
app.use('/', ordersRoutes);
app.use('/', userRoutes);
app.use('/', productRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

const port = process.env.PORT || 3001;

app.get('/', (req, res, next) => {
  res.end('<h1>Hello world</h1>')
});

app.listen(port);