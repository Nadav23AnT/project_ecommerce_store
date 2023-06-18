import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors, { CorsOptions } from 'cors';
import csrf from 'csurf';
import dotenv from 'dotenv';
import globalErrorHandler from '@Controllers/errorController';
import loginLimiter from '@Utils/loginLimiter';
import AppError from '@Utils/AppError';
import userRouter from '@Routes/userRouter';
import categoryRouter from '@Routes/categoryRouter';
import orderRouter from '@Routes/orderRouter';
import { version } from './package.json';

dotenv.config({ path: './.env.dev' });

const app = express();

// 1) GLOBAL MIDDLEWARE

// Set security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Implement CORS
const whitelist = ['http://localhost:5000', 'http://127.0.0.1:5000'];
const corsOptions: CorsOptions = {
  credentials: true, // allow cookies
  origin: (origin, callback) => {
    // (!origin) to allow Postman requests that comes with header: origin === undefined
    const allowPostman = !origin && process.env.NODE_ENV === 'development';

    return allowPostman || (origin && whitelist.indexOf(origin) !== -1)
      ? callback(null, true) // allow request
      : callback(new AppError(`Origin: ${origin} Not allowed by CORS`, 403)); // deny request
  },
};

app.use(cors(corsOptions));
app.options('*', cors());

// Serving static files for example: http://localhost:5000/img/users/usrename.jpeg
// app.use(express.static(path.join(__dirname, '../public'))); // for npm run dev2
app.use(express.static('./public')); // for npm run dev (ts-node-dev)

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Data sanitization against XSS
app.use(xss());

// Limit requests from same API
const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'נשלחו יותר מדי בקשות מכתובת ה-IP שלך, נסה שוב בעוד שעה!',
});
app.use('/api', limiter);

// Limit the attempts to login to 5 times in an hour. Reset the counter  on successful login
app.post('/api/users/login', loginLimiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// to use cookies
app.use(cookieParser());

// ProtectAgainst csrf
const csrfProtection = csrf({
  cookie: true,
});
app.use(csrfProtection);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      // All Models
      'id',
      '_id',
      'createdAt',
      'updatedAt',
      // User Model
      'name',
      'email',
      'photo',
      'role',
      'password',
      'passwordConfirm',
      'passwordChangedAt',
      'passwordResetToken',
      'passwordResetExpires',
      'active',
    ],
  })
);

// compress requests size
app.use(compression());

// 2) ROUTES
app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/orders', orderRouter);
// app.use(`${api}/products`, productsRoutes);
// app.use(`${api}/users`, usersRoutes);
const d
app.get('/api/', (req, res) => res.send(`Server is up and running v${version}`));

app.all('*', (req, res, next) => {
  next(new AppError(`הכתובת ${req.originalUrl} לא קיימת בשרת!`, 404));
});

// all AppError instances errors will catch in this middleware and will be handled in errorController.js
app.use(globalErrorHandler);

export default app;
