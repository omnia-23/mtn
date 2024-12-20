import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config';
import { getConfig } from 'dotenv-handler';
import { errorHandler } from './middleware/errorHandler.middleware';
import indexRouter from './routers/index.router';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();
config();

const app = express();
const PORT = getConfig('PORT');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan(':method :url :status :response-time ms - :date[web]'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  }),
);

app.use(indexRouter);

app.use(errorHandler);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Vercel with TypeScript!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
